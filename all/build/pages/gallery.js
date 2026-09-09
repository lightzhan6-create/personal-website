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

function normalizeStringList(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        return value
            .split(/\r?\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
}

function normalizePhotoEntry(entry, albumMeta = {}) {
    const raw = typeof entry === 'object' && entry !== null
        ? entry.src || entry.url || entry.image || entry.path
        : entry;
    const src = isSafeUrl(raw) ? String(raw).trim() : '';
    if (!src) return null;

    const dimensions = readImageDimensions(src) || {};
    const title = typeof entry === 'object' && entry !== null
        ? String(entry.title || '').trim()
        : '';
    const description = typeof entry === 'object' && entry !== null
        ? String(entry.description || '').trim()
        : '';
    const alt = typeof entry === 'object' && entry !== null
        ? String(entry.alt || title || albumMeta.alt || albumMeta.title || 'Gallery photo').trim()
        : String(albumMeta.alt || albumMeta.title || 'Gallery photo').trim();

    return {
        src,
        title,
        description,
        alt,
        width: Number(dimensions.width) || 0,
        height: Number(dimensions.height) || 0
    };
}

function normalizeAlbumPhotos(data, albumMeta) {
    const imageEntries = normalizeStringList(data.images);
    if (!imageEntries.length && data.image) imageEntries.push(data.image);
    if (!imageEntries.length && data.cover) imageEntries.push(data.cover);

    return imageEntries
        .map((entry) => normalizePhotoEntry(entry, albumMeta))
        .filter(Boolean);
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

        const id = normalizeId(data.slug || data.id, filename);
        if (!id) {
            throw new Error(`Gallery album "${filename}" requires a valid English slug.`);
        }

        if (usedIds.has(id)) {
            throw new Error(`Duplicate gallery album slug: ${id}`);
        }
        usedIds.add(id);

        const title = String(data.title || '').trim();
        const description = String(data.description || data.summary || '').trim();
        const alt = String(data.alt || title || description || 'Gallery photo set').trim();
        const photos = normalizeAlbumPhotos(data, { title, alt });

        if (!photos.length) {
            console.log(`  Skipping gallery album without images: ${filename}`);
            return;
        }

        const cover = isSafeUrl(data.cover) ? String(data.cover).trim() : photos[0].src;
        const coverDimensions = readImageDimensions(cover) || {};

        items.push({
            id,
            slug: id,
            filename,
            title,
            date: formatDate(data.date),
            description,
            alt,
            cover,
            image: cover,
            width: Number(coverDimensions.width) || photos[0].width || 0,
            height: Number(coverDimensions.height) || photos[0].height || 0,
            images: photos,
            photoCount: photos.length,
            href: `/gallery/${encodeURIComponent(id)}/`
        });
    });

    items.sort((a, b) => {
        const byDate = String(b.date || '').localeCompare(String(a.date || ''));
        if (byDate !== 0) return byDate;
        return a.filename.localeCompare(b.filename);
    });

    return items;
}

function renderAlbumCard(item) {
    const sizeAttrs = item.width && item.height
        ? ` width="${item.width}" height="${item.height}"`
        : '';
    const photoCountLabel = `${item.photoCount} ${item.photoCount === 1 ? 'photo' : 'photos'}`;

    return `
        <article class="gallery-album-card">
            <a href="${escape(item.href)}" class="gallery-album-link" aria-label="${escape(item.title || item.alt || 'View photo set')}">
                <div class="gallery-album-cover">
                    <img
                        src="${escape(item.cover)}"
                        alt="${escape(item.alt)}"${sizeAttrs}
                        loading="lazy"
                        decoding="async"
                    >
                    <span class="gallery-album-count" data-i18n-format="gallery.photoCount" data-count="${item.photoCount}">
                        ${escape(photoCountLabel)}
                    </span>
                </div>
                <div class="gallery-album-body">
                    <h2>${escape(item.title || 'Untitled photo set')}</h2>
                    ${item.date ? `<time datetime="${escape(item.date)}">${escape(item.date)}</time>` : ''}
                    ${item.description ? `<p>${escape(item.description)}</p>` : ''}
                </div>
            </a>
        </article>
    `;
}

function renderPhoto(photo, album, index) {
    const title = photo.title || album.title;
    const description = photo.description || '';
    const sizeAttrs = photo.width && photo.height
        ? ` width="${photo.width}" height="${photo.height}"`
        : '';
    const aspectStyle = photo.width && photo.height
        ? ` style="--gallery-photo-ratio:${photo.width}/${photo.height}"`
        : '';

    return `
        <figure class="gallery-photo"${aspectStyle}>
            <button
                type="button"
                class="gallery-photo-button"
                data-gallery-index="${index}"
                aria-label="${escape(title || photo.alt || '查看图片')}"
            >
                <img
                    src="${escape(photo.src)}"
                    alt="${escape(photo.alt)}"${sizeAttrs}
                    loading="lazy"
                    decoding="async"
                >
            </button>
            ${(title || description) ? `
            <figcaption class="gallery-photo-caption">
                ${title ? `<strong>${escape(title)}</strong>` : ''}
                ${description ? `<span>${escape(description)}</span>` : ''}
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
                暂无图集
                </span>
            </h2>
            <p class="text-sm text-slate-500 dark:text-slate-400" data-i18n="gallery.emptyDescription">
                后续发布 Gallery Album 后，会统一显示在这里。
            </p>
        </section>
    `;
}

function renderLightboxData(album) {
    const photos = album
        ? album.images.map((photo) => ({
            src: photo.src,
            title: photo.title || album.title,
            date: album.date,
            description: photo.description || album.description,
            alt: photo.alt,
            width: photo.width,
            height: photo.height
        }))
        : [];

    return JSON.stringify(photos).replace(/</g, '\\u003c');
}

function renderBackLink() {
    return `
        <a href="/gallery/" class="mb-7 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-primary dark:text-slate-400">
            <span aria-hidden="true">←</span>
            <span data-i18n="gallery.back">返回图库</span>
        </a>
    `;
}

function renderAlbumIntro(album) {
    const photoCountLabel = `${album.photoCount} ${album.photoCount === 1 ? 'photo' : 'photos'}`;
    return `
        <div class="gallery-album-intro mx-auto mb-10 max-w-3xl text-center">
            <div class="mb-4 flex flex-wrap justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                ${album.date ? `<time datetime="${escape(album.date)}">${escape(album.date)}</time>` : ''}
                <span data-i18n-format="gallery.photoCount" data-count="${album.photoCount}">${escape(photoCountLabel)}</span>
            </div>
            ${album.description ? `<p class="text-base leading-8 text-slate-500 dark:text-slate-400">${escape(album.description)}</p>` : ''}
        </div>
    `;
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
        image: items[0] ? items[0].cover : seo.defaultImage(siteConfig, seoConfig)
    });

    const html = replacePlaceholders(template, [
        ['<!-- GALLERY_SEO_HEAD -->', seoHead],
        ['<!-- GALLERY_BACK_LINK -->', ''],
        ['<!-- GALLERY_PAGE_LABEL -->', '<span data-i18n="gallery.pageLabel">Photo Gallery</span>'],
        ['<!-- GALLERY_PAGE_TITLE -->', '<span data-i18n="gallery.pageTitle">图库</span>'],
        ['<!-- GALLERY_PAGE_DESCRIPTION -->', '<p class="mx-auto max-w-3xl text-base leading-8 text-slate-500 dark:text-slate-400" data-i18n="gallery.pageDescription">记录项目、工作、生活与一些值得留下的瞬间。</p>'],
        ['<!-- GALLERY_ALBUM_INTRO -->', ''],
        ['<!-- GALLERY_GRID_CLASS -->', 'gallery-album-grid'],
        ['<!-- GALLERY_ITEMS -->', items.map(renderAlbumCard).join('\n')],
        ['<!-- GALLERY_EMPTY_STATE -->', renderEmptyState(items)],
        ['<!-- GALLERY_LIGHTBOX_DATA -->', renderLightboxData(null)]
    ]);

    fs.writeFileSync(path.join(outputDir, 'gallery.html'), html, 'utf-8');
    console.log('  Generated: gallery.html');
}

function generateDetailPages({
    items,
    template,
    siteConfig,
    seoConfig,
    outputDir
}) {
    const galleryOutputDir = path.join(outputDir, 'gallery');
    fs.mkdirSync(galleryOutputDir, { recursive: true });

    items.forEach((album) => {
        const pageTitle = `${album.title || 'Gallery Album'} - ${siteConfig.site_title || siteConfig.site_name || 'FreeCat Blog'}`;
        const seoHead = seo.renderHeadTags({
            title: pageTitle,
            description: album.description || 'Gallery photo set.',
            canonicalPath: `/gallery/${album.id}/`,
            siteConfig,
            seoConfig,
            image: album.cover
        });

        const html = replacePlaceholders(template, [
            ['<!-- GALLERY_SEO_HEAD -->', seoHead],
            ['<!-- GALLERY_BACK_LINK -->', renderBackLink()],
            ['<!-- GALLERY_PAGE_LABEL -->', '<span data-i18n="gallery.albumLabel">Gallery Album</span>'],
            ['<!-- GALLERY_PAGE_TITLE -->', escape(album.title || 'Untitled photo set')],
            ['<!-- GALLERY_PAGE_DESCRIPTION -->', ''],
            ['<!-- GALLERY_ALBUM_INTRO -->', renderAlbumIntro(album)],
            ['<!-- GALLERY_GRID_CLASS -->', 'gallery-photo-grid'],
            ['<!-- GALLERY_ITEMS -->', album.images.map((photo, index) => renderPhoto(photo, album, index)).join('\n')],
            ['<!-- GALLERY_EMPTY_STATE -->', ''],
            ['<!-- GALLERY_LIGHTBOX_DATA -->', renderLightboxData(album)]
        ]);

        const detailDir = path.join(galleryOutputDir, album.id);
        fs.mkdirSync(detailDir, { recursive: true });
        fs.writeFileSync(path.join(detailDir, 'index.html'), html, 'utf-8');
        console.log(`  Generated: gallery/${album.id}/index.html`);
    });
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
    generateDetailPages({
        items,
        template: listTemplate,
        siteConfig,
        seoConfig,
        outputDir
    });

    console.log(`  Published gallery albums: ${items.length}`);
}

module.exports = {
    loadGalleryItems,
    generate
};
