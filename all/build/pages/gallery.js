const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const shared = require('../../shared/shared.js');
const { replacePlaceholders } = require('../template-engine.js');
const { isContentFile } = require('../content-files.js');
const seo = require('../seo.js');

function escape(value) {
    return shared.escapeHtml(String(value || ''));
}

function normalizeId(value, filename) {
    const source = String(value || path.parse(filename).name)
        .trim()
        .toLowerCase();

    return source
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9_-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function formatDate(value) {
    if (!value) return '';
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }

    const source = String(value).trim();
    if (!source) return '';

    const dateOnlyMatch = source.match(/^(\d{4}-\d{2}-\d{2})/);
    if (dateOnlyMatch) return dateOnlyMatch[1];

    const parsedDate = new Date(source);
    if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().slice(0, 10);
    }

    return source;
}

function isSafeUrl(value) {
    const source = String(value || '').trim();
    if (!source) return false;
    if (source.startsWith('/')) return true;

    try {
        const url = new URL(source);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

function resolveLocalAssetPath(image) {
    const source = String(image || '').trim();
    if (!source.startsWith('/')) return '';

    const cleanPath = source.split(/[?#]/)[0];
    const candidates = [
        path.join(__dirname, '..', '..', '..', 'public', cleanPath.replace(/^\/uploads\//, 'uploads/')),
        path.join(__dirname, '..', '..', '..', 'all', cleanPath.replace(/^\//, ''))
    ];

    return candidates.find((candidate) => fs.existsSync(candidate)) || '';
}

function readPngDimensions(buffer) {
    if (
        buffer.length >= 24 &&
        buffer.readUInt32BE(0) === 0x89504e47 &&
        buffer.readUInt32BE(4) === 0x0d0a1a0a
    ) {
        return {
            width: buffer.readUInt32BE(16),
            height: buffer.readUInt32BE(20)
        };
    }

    return null;
}

function readJpegDimensions(buffer) {
    if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
        return null;
    }

    let offset = 2;
    while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) return null;
        const marker = buffer[offset + 1];
        offset += 2;

        if (marker === 0xd9 || marker === 0xda) break;
        const size = buffer.readUInt16BE(offset);
        if (size < 2) return null;

        if (
            marker >= 0xc0 &&
            marker <= 0xcf &&
            ![0xc4, 0xc8, 0xcc].includes(marker)
        ) {
            return {
                height: buffer.readUInt16BE(offset + 3),
                width: buffer.readUInt16BE(offset + 5)
            };
        }

        offset += size;
    }

    return null;
}

function readImageDimensions(image) {
    const localPath = resolveLocalAssetPath(image);
    if (!localPath) return null;

    try {
        const buffer = fs.readFileSync(localPath);
        return readPngDimensions(buffer) || readJpegDimensions(buffer);
    } catch {
        return null;
    }
}

function loadGalleryItems(galleryDir) {
    if (!fs.existsSync(galleryDir)) {
        console.log('  Gallery directory not found.');
        return [];
    }

    const files = fs.readdirSync(galleryDir).filter(isContentFile);
    const items = [];
    const usedIds = new Set();

    files.forEach((filename) => {
        const filePath = path.join(galleryDir, filename);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(raw);

        if (data.show === false) {
            console.log(`  Skipping hidden gallery item: ${filename}`);
            return;
        }

        const image = isSafeUrl(data.image) ? String(data.image).trim() : '';
        if (!image) {
            console.log(`  Skipping gallery item without image: ${filename}`);
            return;
        }

        const id = normalizeId(data.id || data.slug, filename);
        if (!id) {
            throw new Error(`Gallery item "${filename}" requires a valid English id.`);
        }

        if (usedIds.has(id)) {
            throw new Error(`Duplicate gallery id: ${id}`);
        }
        usedIds.add(id);

        const title = String(data.title || '').trim();
        const description = String(data.description || data.summary || '').trim();
        const dimensions = readImageDimensions(image) || {};

        items.push({
            id,
            filename,
            image,
            title,
            date: formatDate(data.date),
            description,
            alt: String(data.alt || title || description || 'Gallery photo').trim(),
            width: Number(dimensions.width) || 0,
            height: Number(dimensions.height) || 0
        });
    });

    items.sort((a, b) => {
        const byDate = String(b.date || '').localeCompare(String(a.date || ''));
        if (byDate !== 0) return byDate;
        return a.filename.localeCompare(b.filename);
    });

    return items;
}

function renderPhoto(item, index) {
    const hasMeta = item.title || item.date || item.description;
    const sizeAttrs = item.width && item.height
        ? ` width="${item.width}" height="${item.height}"`
        : '';
    const aspectStyle = item.width && item.height
        ? ` style="--gallery-photo-ratio:${item.width}/${item.height}"`
        : '';

    return `
        <figure class="gallery-photo"${aspectStyle}>
            <button
                type="button"
                class="gallery-photo-button"
                data-gallery-index="${index}"
                aria-label="${escape(item.title || item.alt || '查看图片')}"
            >
                <img
                    src="${escape(item.image)}"
                    alt="${escape(item.alt)}"${sizeAttrs}
                    loading="lazy"
                    decoding="async"
                >
            </button>
            ${hasMeta ? `
            <figcaption class="gallery-photo-caption">
                ${item.title ? `<strong>${escape(item.title)}</strong>` : ''}
                ${item.date ? `<time datetime="${escape(item.date)}">${escape(item.date)}</time>` : ''}
                ${item.description ? `<span>${escape(item.description)}</span>` : ''}
            </figcaption>
            ` : ''}
        </figure>
    `;
}

function renderEmptyState(items) {
    if (items.length) return '';
    return `
        <section
            class="rounded-3xl border border-dashed border-slate-300 px-6 py-20 text-center dark:border-slate-700"
        >
            <h2 class="mb-3 text-2xl font-semibold text-slate-800 dark:text-white">
                <span data-i18n="gallery.emptyTitle">
                暂无图片
                </span>
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400" data-i18n="gallery.emptyDescription">
                后续上传图片并发布后，会统一显示在这里。
            </p>
        </section>
    `;
}

function renderLightboxData(items) {
    return JSON.stringify(items.map((item) => ({
        src: item.image,
        title: item.title,
        date: item.date,
        description: item.description,
        alt: item.alt,
        width: item.width,
        height: item.height
    }))).replace(/</g, '\\u003c');
}

function generateListPage({
    items,
    template,
    siteConfig,
    seoConfig,
    outputDir
}) {
    const pageTitle = `图库 - ${siteConfig.site_title || siteConfig.site_name || 'FreeCat Blog'}`;

    const seoHead = seo.renderHeadTags({
        title: pageTitle,
        description: '记录项目、工作、生活与一些值得留下的瞬间。',
        canonicalPath: '/gallery',
        siteConfig,
        seoConfig,
        image: items[0] ? items[0].image : seo.defaultImage(siteConfig, seoConfig)
    });

    const html = replacePlaceholders(template, [
        ['<!-- GALLERY_SEO_HEAD -->', seoHead],
        ['<!-- GALLERY_ITEMS -->', items.map(renderPhoto).join('\n')],
        ['<!-- GALLERY_EMPTY_STATE -->', renderEmptyState(items)],
        ['<!-- GALLERY_LIGHTBOX_DATA -->', renderLightboxData(items)]
    ]);

    fs.writeFileSync(path.join(outputDir, 'gallery.html'), html, 'utf-8');
    console.log('  Generated: gallery.html');
}

function generate({
    listTemplate,
    siteConfig,
    seoConfig,
    galleryDir,
    outputDir
}) {
    console.log('🖼️ Generating gallery pages...');

    const items = loadGalleryItems(galleryDir);
    generateListPage({
        items,
        template: listTemplate,
        siteConfig,
        seoConfig,
        outputDir
    });

    console.log(`  Published gallery items: ${items.length}`);
}

module.exports = {
    loadGalleryItems,
    generate
};
