const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const shared = require('../../shared/shared.js');
const {
    parseMarkdown,
    autoSpacingHtml,
    applyParagraphAlignment,
    extractHeadingsAndGenerateTOC,
    addHeadingIds
} = require('../markdown.js');
const { replacePlaceholders } = require('../template-engine.js');
const seo = require('../seo.js');

const CATEGORY_LABELS = {
    project: '项目现场',
    work: '工作记录',
    study: '学习记录',
    travel: '旅行记录',
    life: '生活记录',
    other: '其他图片'
};

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
    if (!value) {
        return '未填写';
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const year = value.getUTCFullYear();
        const month = String(value.getUTCMonth() + 1).padStart(2, '0');
        const day = String(value.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const source = String(value).trim();

    if (!source) {
        return '未填写';
    }

    const dateOnlyMatch = source.match(/^(\d{4}-\d{2}-\d{2})/);

    if (dateOnlyMatch) {
        return dateOnlyMatch[1];
    }

    const parsedDate = new Date(source);

    if (!Number.isNaN(parsedDate.getTime())) {
        const year = parsedDate.getUTCFullYear();
        const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getUTCDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    return source;
}

function normalizeStringArray(value) {
    if (Array.isArray(value)) {
        return value
            .map((item) => String(item || '').trim())
            .filter(Boolean);
    }

    if (!value) {
        return [];
    }

    return [String(value).trim()].filter(Boolean);
}

function isSafeUrl(value) {
    const source = String(value || '').trim();

    if (!source) {
        return false;
    }

    if (source.startsWith('/')) {
        return true;
    }

    try {
        const url = new URL(source);

        return (
            url.protocol === 'https:' ||
            url.protocol === 'http:'
        );
    } catch {
        return false;
    }
}

function loadGalleryItems(galleryDir) {
    if (!fs.existsSync(galleryDir)) {
        console.log('  Gallery directory not found.');
        return [];
    }

    const files = fs.readdirSync(galleryDir)
        .filter((name) => /\.(md|markdown)$/i.test(name));

    const items = [];
    const usedIds = new Set();

    files.forEach((filename) => {
        const filePath = path.join(galleryDir, filename);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(raw);

        if (data.show === false) {
            console.log(`  Skipping hidden gallery item: ${filename}`);
            return;
        }

        const id = normalizeId(data.id, filename);

        if (!id) {
            throw new Error(
                `Gallery item "${filename}" requires a valid English id.`
            );
        }

        if (usedIds.has(id)) {
            throw new Error(`Duplicate gallery id: ${id}`);
        }

        usedIds.add(id);

        const category = CATEGORY_LABELS[data.category]
            ? data.category
            : 'other';

        const image = isSafeUrl(data.image)
            ? String(data.image).trim()
            : '';

        const thumbnail = isSafeUrl(data.thumbnail)
            ? String(data.thumbnail).trim()
            : image;

        items.push({
            id,
            filename,
            title: String(
                data.title || path.parse(filename).name
            ).trim(),
            category,
            categoryLabel: CATEGORY_LABELS[category],
            date: formatDate(data.date),
            updated: formatDate(data.updated || data.date),
            location: String(data.location || '未填写').trim(),
            photographer: String(
                data.photographer || '未填写'
            ).trim(),
            image,
            thumbnail,
            alt: String(
                data.alt || data.title || '图库图片'
            ).trim(),
            summary: String(data.summary || '').trim(),
            tags: normalizeStringArray(data.tags),
            relatedProjects: normalizeStringArray(
                data.related_projects
            ),
            relatedArticles: normalizeStringArray(
                data.related_articles
            ),
            featured: data.featured === true,
            content
        });
    });

    items.sort((a, b) => {
        if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
        }

        return String(b.date).localeCompare(String(a.date));
    });

    return items;
}

function renderCategoryBadge(item) {
    return `
        <span
            class="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
        >
            ${escape(item.categoryLabel)}
        </span>
    `;
}

function renderFeaturedBadge(item) {
    if (!item.featured) {
        return '';
    }

    return `
        <span
            class="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
        >
            精选图片
        </span>
    `;
}

function renderCardImage(item) {
    if (!item.thumbnail) {
        return `
            <div
                class="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-slate-400 dark:from-slate-800 dark:to-slate-900 dark:text-slate-500"
            >
                暂无图片
            </div>
        `;
    }

    return `
        <img
            src="${escape(item.thumbnail)}"
            alt="${escape(item.alt)}"
            class="block h-auto w-full object-cover"
            loading="lazy"
            decoding="async"
        >
    `;
}

function renderGalleryCard(item) {
    const itemUrl = `/gallery/${encodeURIComponent(item.id)}/`;

    return `
        <article
            class="gallery-card border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            data-gallery-category="${escape(item.category)}"
        >
            <a href="${itemUrl}" class="block">
                ${renderCardImage(item)}

                <div class="p-5">
                    <div class="mb-4 flex flex-wrap gap-2">
                        ${renderCategoryBadge(item)}
                        ${renderFeaturedBadge(item)}
                    </div>

                    <h2
                        class="mb-3 text-xl font-semibold leading-snug text-slate-900 dark:text-white"
                    >
                        ${escape(item.title)}
                    </h2>

                    <p
                        class="mb-5 text-sm leading-7 text-slate-500 dark:text-slate-400"
                    >
                        ${escape(item.summary || '暂无图片说明。')}
                    </p>

                    <dl
                        class="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-800"
                    >
                        <div>
                            <dt class="mb-1 text-slate-400">记录时间</dt>
                            <dd class="text-slate-600 dark:text-slate-300">
                                ${escape(item.date)}
                            </dd>
                        </div>

                        <div>
                            <dt class="mb-1 text-slate-400">记录地点</dt>
                            <dd class="text-slate-600 dark:text-slate-300">
                                ${escape(item.location)}
                            </dd>
                        </div>
                    </dl>

                    <span
                        class="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
                    >
                        查看图片
                        <span aria-hidden="true">→</span>
                    </span>
                </div>
            </a>
        </article>
    `;
}

function renderDetailImage(item) {
    if (!item.image) {
        return `
            <div
                class="flex min-h-[420px] w-full items-center justify-center text-slate-400"
            >
                暂无原图
            </div>
        `;
    }

    return `
        <img
            src="${escape(item.image)}"
            alt="${escape(item.alt)}"
            class="gallery-detail-image"
            loading="eager"
            decoding="async"
        >
    `;
}

function renderOriginalLink(item) {
    if (!item.image) {
        return `
            <span class="text-sm text-slate-400">
                暂无原图链接
            </span>
        `;
    }

    return `
        <a
            href="${escape(item.image)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
            查看原图
            <span aria-hidden="true">↗</span>
        </a>
    `;
}

function renderGalleryMarkdown(item) {
    const { toc, headings } =
        extractHeadingsAndGenerateTOC(item.content);

    let html = parseMarkdown(item.content, {
        enableImageCaptions: true,
        markMarkdownHeadings: true
    });

    html = addHeadingIds(html, headings);
    html = autoSpacingHtml(html);
    html = applyParagraphAlignment(html);

    return {
        html,
        toc
    };
}

function renderRelatedProjects(item) {
    if (!item.relatedProjects.length) {
        return '<p>暂未关联项目。</p>';
    }

    const links = item.relatedProjects
        .map((projectId) => {
            const safeId = encodeURIComponent(projectId);

            return `
                <li>
                    <a
                        href="/projects/${safeId}/"
                        class="text-primary hover:underline"
                    >
                        ${escape(projectId)}
                    </a>
                </li>
            `;
        })
        .join('');

    return `<ul class="space-y-2">${links}</ul>`;
}

function renderRelatedArticles(item) {
    if (!item.relatedArticles.length) {
        return '<p>暂未关联文章。</p>';
    }

    const links = item.relatedArticles
        .map((articleUrl) => {
            if (!isSafeUrl(articleUrl)) {
                return '';
            }

            return `
                <li>
                    <a
                        href="${escape(articleUrl)}"
                        class="text-primary hover:underline"
                    >
                        ${escape(articleUrl)}
                    </a>
                </li>
            `;
        })
        .filter(Boolean)
        .join('');

    if (!links) {
        return '<p>暂未关联文章。</p>';
    }

    return `<ul class="space-y-2">${links}</ul>`;
}

function generateListPage({
    items,
    template,
    siteConfig,
    seoConfig,
    outputDir
}) {
    const pageTitle =
        `图库 - ${
            siteConfig.site_title ||
            siteConfig.site_name ||
            'FreeCat Blog'
        }`;

    const seoHead = seo.renderHeadTags({
        title: pageTitle,
        description:
            '记录项目现场、工作过程、学习经历、旅行和生活中的图片。',
        canonicalPath: '/gallery',
        siteConfig,
        seoConfig,
        image: seo.defaultImage(siteConfig, seoConfig)
    });

    const itemsHtml = items
        .map(renderGalleryCard)
        .join('\n');

    const html = replacePlaceholders(template, [
        ['<!-- GALLERY_SEO_HEAD -->', seoHead],
        ['<!-- GALLERY_ITEMS -->', itemsHtml]
    ]);

    fs.writeFileSync(
        path.join(outputDir, 'gallery.html'),
        html,
        'utf-8'
    );

    console.log('  Generated: gallery.html');
}

function generateDetailPages({
    items,
    template,
    siteConfig,
    seoConfig,
    outputDir
}) {
    const galleryOutputDir =
        path.join(outputDir, 'gallery');

    fs.mkdirSync(galleryOutputDir, {
        recursive: true
    });

    items.forEach((item) => {
        const rendered = renderGalleryMarkdown(item);
        const itemPath = `/gallery/${item.id}/`;

        const pageTitle =
            `${item.title} - ${
                siteConfig.site_title ||
                siteConfig.site_name ||
                'FreeCat Blog'
            }`;

        const seoHead = seo.renderHeadTags({
            title: pageTitle,
            description:
                item.summary ||
                seo.defaultDescription(siteConfig, seoConfig),
            canonicalPath: itemPath,
            siteConfig,
            seoConfig,
            image:
                item.image ||
                seo.defaultImage(siteConfig, seoConfig),
            type: 'article',
            publishedTime: item.date,
            modifiedTime: item.updated
        });

        const html = replacePlaceholders(template, [
            ['<!-- GALLERY_ITEM_SEO_HEAD -->', seoHead],
            [/<!-- GALLERY_TITLE -->/g, escape(item.title)],
            ['<!-- GALLERY_SUMMARY -->', escape(item.summary)],
            ['<!-- GALLERY_CATEGORY_BADGE -->', renderCategoryBadge(item)],
            ['<!-- GALLERY_FEATURED_BADGE -->', renderFeaturedBadge(item)],
            ['<!-- GALLERY_IMAGE -->', renderDetailImage(item)],
            ['<!-- GALLERY_DATE -->', escape(item.date)],
            ['<!-- GALLERY_LOCATION -->', escape(item.location)],
            ['<!-- GALLERY_PHOTOGRAPHER -->', escape(item.photographer)],
            ['<!-- GALLERY_UPDATED -->', escape(item.updated)],
            ['<!-- GALLERY_ORIGINAL_LINK -->', renderOriginalLink(item)],
            ['<!-- GALLERY_CONTENT -->', rendered.html],
            ['<!-- GALLERY_TOC -->', rendered.toc],
            ['<!-- GALLERY_RELATED_PROJECTS -->', renderRelatedProjects(item)],
            ['<!-- GALLERY_RELATED_ARTICLES -->', renderRelatedArticles(item)]
        ]);

        const itemOutputDir =
            path.join(galleryOutputDir, item.id);

        fs.mkdirSync(itemOutputDir, {
            recursive: true
        });

        fs.writeFileSync(
            path.join(itemOutputDir, 'index.html'),
            html,
            'utf-8'
        );

        console.log(
            `  Generated: gallery/${item.id}/index.html`
        );
    });
}

function generate({
    listTemplate,
    detailTemplate,
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
        template: detailTemplate,
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
