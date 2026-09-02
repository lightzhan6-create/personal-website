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

const PLATFORM_LABELS = {
    youtube: 'YouTube',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    douyin: '抖音',
    kuaishou: '快手',
    'wechat-video': '视频号',
    xiaohongshu: '小红书',
    local: '本地视频'
};

const CATEGORY_LABELS = {
    project: '项目视频',
    knowledge: '知识分享',
    tutorial: '教程',
    work: '工作记录',
    life: '生活记录',
    interview: '访谈',
    other: '其他'
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
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
        return false;
    }
}

function isSafeEmbedUrl(value) {
    const source = String(value || '').trim();

    if (!source) {
        return false;
    }

    try {
        const url = new URL(source);

        if (url.protocol !== 'https:') {
            return false;
        }

        const hostname = url.hostname.toLowerCase();

        const allowedHosts = [
            'www.youtube.com',
            'youtube.com',
            'www.youtube-nocookie.com',
            'youtube-nocookie.com',
            'player.vimeo.com',
            'www.facebook.com',
            'facebook.com',
            'www.tiktok.com',
            'tiktok.com'
        ];

        return allowedHosts.includes(hostname);
    } catch {
        return false;
    }
}

function loadVideos(videosDir) {
    if (!fs.existsSync(videosDir)) {
        console.log('  Videos directory not found.');
        return [];
    }

    const files = fs.readdirSync(videosDir)
        .filter((name) => /\.(md|markdown)$/i.test(name));

    const videos = [];
    const usedIds = new Set();

    files.forEach((filename) => {
        const filePath = path.join(videosDir, filename);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(raw);

        if (data.show === false) {
            console.log(`  Skipping hidden video: ${filename}`);
            return;
        }

        const id = normalizeId(data.id, filename);

        if (!id) {
            throw new Error(
                `Video "${filename}" requires a valid English id.`
            );
        }

        if (usedIds.has(id)) {
            throw new Error(`Duplicate video id: ${id}`);
        }

        usedIds.add(id);

        const platform = PLATFORM_LABELS[data.platform]
            ? data.platform
            : 'local';

        const category = CATEGORY_LABELS[data.category]
            ? data.category
            : 'other';

        videos.push({
            id,
            filename,
            title: String(
                data.title || path.parse(filename).name
            ).trim(),
            platform,
            platformLabel: PLATFORM_LABELS[platform],
            category,
            categoryLabel: CATEGORY_LABELS[category],
            date: formatDate(data.date),
            updated: formatDate(data.updated || data.date),
            duration: String(data.duration || '未填写').trim(),
            creator: String(data.creator || '未填写').trim(),
            sourceUrl: isSafeUrl(data.source_url)
                ? String(data.source_url).trim()
                : '',
            embedUrl: isSafeEmbedUrl(data.embed_url)
                ? String(data.embed_url).trim()
                : '',
            cover: isSafeUrl(data.cover)
                ? String(data.cover).trim()
                : '',
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

    videos.sort((a, b) => {
        if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
        }

        return String(b.date).localeCompare(String(a.date));
    });

    return videos;
}

function renderPlatformBadge(video) {
    return `
        <span
            class="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
        >
            ${escape(video.platformLabel)}
        </span>
    `;
}

function renderCategoryBadge(video) {
    return `
        <span
            class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
            ${escape(video.categoryLabel)}
        </span>
    `;
}

function renderFeaturedBadge(video) {
    if (!video.featured) {
        return '';
    }

    return `
        <span
            class="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
        >
            精选视频
        </span>
    `;
}

function renderVideoCover(video) {
    if (video.cover) {
        return `
            <div class="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                    src="${escape(video.cover)}"
                    alt="${escape(video.title)}"
                    class="w-full object-cover"
                    loading="lazy"
                    decoding="async"
                >

                <span
                    class="absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                >
                    <span
                        class="flex size-16 items-center justify-center rounded-full bg-black/65 text-2xl text-white backdrop-blur-sm"
                    >
                        ▶
                    </span>
                </span>
            </div>
        `;
    }

    return `
        <div
            class="flex aspect-video items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 dark:from-slate-800 dark:to-slate-900 dark:text-slate-500"
        >
            <span
                class="flex size-16 items-center justify-center rounded-full bg-white/70 text-2xl shadow-sm dark:bg-slate-700"
                aria-hidden="true"
            >
                ▶
            </span>
        </div>
    `;
}

function renderVideoCard(video) {
    const videoUrl = `/videos/${encodeURIComponent(video.id)}/`;

    return `
        <article
            class="video-card overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            data-video-platform="${escape(video.platform)}"
        >
            <a href="${videoUrl}" class="block">
                ${renderVideoCover(video)}

                <div class="p-6">
                    <div class="mb-4 flex flex-wrap gap-2">
                        ${renderPlatformBadge(video)}
                        ${renderCategoryBadge(video)}
                        ${renderFeaturedBadge(video)}
                    </div>

                    <h2
                        class="mb-3 text-xl font-semibold leading-snug text-slate-900 dark:text-white"
                    >
                        ${escape(video.title)}
                    </h2>

                    <p
                        class="mb-5 text-sm leading-7 text-slate-500 dark:text-slate-400"
                    >
                        ${escape(video.summary || '暂无视频摘要。')}
                    </p>

                    <dl
                        class="mb-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-800"
                    >
                        <div>
                            <dt class="mb-1 text-slate-400">发布日期</dt>
                            <dd class="text-slate-600 dark:text-slate-300">
                                ${escape(video.date)}
                            </dd>
                        </div>

                        <div>
                            <dt class="mb-1 text-slate-400">视频时长</dt>
                            <dd class="text-slate-600 dark:text-slate-300">
                                ${escape(video.duration)}
                            </dd>
                        </div>
                    </dl>

                    <span
                        class="inline-flex items-center gap-2 text-sm font-medium text-primary"
                    >
                        查看视频
                        <span aria-hidden="true">→</span>
                    </span>
                </div>
            </a>
        </article>
    `;
}

function renderPlayer(video) {
    if (video.embedUrl) {
        return `
            <div class="video-player-shell">
                <iframe
                    src="${escape(video.embedUrl)}"
                    title="${escape(video.title)}"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    referrerpolicy="strict-origin-when-cross-origin"
                ></iframe>
            </div>
        `;
    }

    if (video.cover) {
        return `
            <div class="relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                    src="${escape(video.cover)}"
                    alt="${escape(video.title)}"
                    class="max-h-[620px] w-full object-cover"
                    loading="eager"
                    decoding="async"
                >

                <span
                    class="absolute inset-0 flex items-center justify-center"
                    aria-hidden="true"
                >
                    <span
                        class="flex size-20 items-center justify-center rounded-full bg-black/65 text-3xl text-white backdrop-blur-sm"
                    >
                        ▶
                    </span>
                </span>
            </div>
        `;
    }

    return `
        <div
            class="video-player-shell flex items-center justify-center text-slate-400"
        >
            暂无视频预览
        </div>
    `;
}

function renderSourceLink(video) {
    if (!video.sourceUrl) {
        return `
            <span class="text-sm text-slate-400">
                暂无原始视频链接
            </span>
        `;
    }

    return `
        <a
            href="${escape(video.sourceUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
            前往原平台观看
            <span aria-hidden="true">↗</span>
        </a>
    `;
}

function renderVideoMarkdown(video) {
    const { toc, headings } =
        extractHeadingsAndGenerateTOC(video.content);

    let html = parseMarkdown(video.content, {
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

function renderRelatedProjects(video) {
    if (!video.relatedProjects.length) {
        return '<p>暂未关联项目。</p>';
    }

    const items = video.relatedProjects
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

    return `<ul class="space-y-2">${items}</ul>`;
}

function renderRelatedArticles(video) {
    if (!video.relatedArticles.length) {
        return '<p>暂未关联文章。</p>';
    }

    const items = video.relatedArticles
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

    if (!items) {
        return '<p>暂未关联文章。</p>';
    }

    return `<ul class="space-y-2">${items}</ul>`;
}

function generateListPage({
    videos,
    template,
    siteConfig,
    seoConfig,
    outputDir
}) {
    const pageTitle =
        `视频 - ${
            siteConfig.site_title ||
            siteConfig.site_name ||
            'FreeCat Blog'
        }`;

    const seoHead = seo.renderHeadTags({
        title: pageTitle,
        description:
            '整理项目、知识、学习和生活相关的视频内容。',
        canonicalPath: '/videos',
        siteConfig,
        seoConfig,
        image: seo.defaultImage(siteConfig, seoConfig)
    });

    const itemsHtml = videos
        .map(renderVideoCard)
        .join('\n');

    const html = replacePlaceholders(template, [
        ['<!-- VIDEOS_SEO_HEAD -->', seoHead],
        ['<!-- VIDEOS_ITEMS -->', itemsHtml]
    ]);

    fs.writeFileSync(
        path.join(outputDir, 'videos.html'),
        html,
        'utf-8'
    );

    console.log('  Generated: videos.html');
}

function generateDetailPages({
    videos,
    template,
    siteConfig,
    seoConfig,
    outputDir
}) {
    const videosOutputDir =
        path.join(outputDir, 'videos');

    fs.mkdirSync(videosOutputDir, {
        recursive: true
    });

    videos.forEach((video) => {
        const rendered = renderVideoMarkdown(video);
        const videoPath = `/videos/${video.id}/`;

        const pageTitle =
            `${video.title} - ${
                siteConfig.site_title ||
                siteConfig.site_name ||
                'FreeCat Blog'
            }`;

        const seoHead = seo.renderHeadTags({
            title: pageTitle,
            description:
                video.summary ||
                seo.defaultDescription(siteConfig, seoConfig),
            canonicalPath: videoPath,
            siteConfig,
            seoConfig,
            image:
                video.cover ||
                seo.defaultImage(siteConfig, seoConfig),
            type: 'article',
            publishedTime: video.date,
            modifiedTime: video.updated
        });

        const html = replacePlaceholders(template, [
            ['<!-- VIDEO_SEO_HEAD -->', seoHead],
            [/<!-- VIDEO_TITLE -->/g, escape(video.title)],
            ['<!-- VIDEO_SUMMARY -->', escape(video.summary)],
            ['<!-- VIDEO_PLATFORM_BADGE -->', renderPlatformBadge(video)],
            ['<!-- VIDEO_CATEGORY_BADGE -->', renderCategoryBadge(video)],
            ['<!-- VIDEO_FEATURED_BADGE -->', renderFeaturedBadge(video)],
            ['<!-- VIDEO_PLAYER -->', renderPlayer(video)],
            ['<!-- VIDEO_DATE -->', escape(video.date)],
            ['<!-- VIDEO_DURATION -->', escape(video.duration)],
            ['<!-- VIDEO_CREATOR -->', escape(video.creator)],
            ['<!-- VIDEO_UPDATED -->', escape(video.updated)],
            ['<!-- VIDEO_SOURCE_LINK -->', renderSourceLink(video)],
            ['<!-- VIDEO_CONTENT -->', rendered.html],
            ['<!-- VIDEO_TOC -->', rendered.toc],
            ['<!-- VIDEO_RELATED_PROJECTS -->', renderRelatedProjects(video)],
            ['<!-- VIDEO_RELATED_ARTICLES -->', renderRelatedArticles(video)]
        ]);

        const videoOutputDir =
            path.join(videosOutputDir, video.id);

        fs.mkdirSync(videoOutputDir, {
            recursive: true
        });

        fs.writeFileSync(
            path.join(videoOutputDir, 'index.html'),
            html,
            'utf-8'
        );

        console.log(
            `  Generated: videos/${video.id}/index.html`
        );
    });
}

function generate({
    listTemplate,
    detailTemplate,
    siteConfig,
    seoConfig,
    videosDir,
    outputDir
}) {
    console.log('🎬 Generating video pages...');

    const videos = loadVideos(videosDir);

    generateListPage({
        videos,
        template: listTemplate,
        siteConfig,
        seoConfig,
        outputDir
    });

    generateDetailPages({
        videos,
        template: detailTemplate,
        siteConfig,
        seoConfig,
        outputDir
    });

    console.log(`  Published videos: ${videos.length}`);
}

module.exports = {
    loadVideos,
    generate
};
