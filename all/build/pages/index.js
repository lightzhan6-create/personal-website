const fs = require('fs');
const path = require('path');
const shared = require('../../shared/shared.js');
const postCardTemplate = require('../../shared/post-card-template.js');
const { generatePaginationHtml } = require('../pagination.js');
const seo = require('../seo.js');
const { replacePlaceholders } = require('../template-engine.js');
const { normalizePostTags } = require('../article-model.js');
const { getDesktopTitleLayout } = require('../post-card-title-layout.js');
const { ALL_PAGE_MOBILE_CARD_OPTIONS } = postCardTemplate;

/**
 * 渲染分页首页（index.html + page/N/index.html）。
 */
function getCardAnimationDelay(index, step = 50) {
    return Math.min(index, 10) * step;
}

function renderPostCardForList(post, index = 0, options = {}) {
    const cardOptions = { ...options };
    const tags = normalizePostTags(post);
    // 首页 / 全部页 使用带 dark hover 的 tag 风格（与原有视觉一致）
    const tagsHtml = tags.map(t => shared.renderTagSpan(t, { darkHover: true })).join('');
    const animationDelayStep = Number.isFinite(Number(cardOptions.animationDelayStep))
        ? Number(cardOptions.animationDelayStep)
        : 50;
    const previewText = post.preview || post.excerpt;
    const desktopTitleLayout = cardOptions.layout === 'compact-grid'
        ? null
        : getDesktopTitleLayout(post.title, { hasCover: !!post.cover });

    return postCardTemplate.renderPostCard({
        link: post.link,
        // titleHtml / excerptHtml 字段语义为"已安全的 HTML 片段"，由调用方 escape；
        // 对 title 先 escape 再 processTitleHtml（| 替换为 <span>），顺序不能反
        titleHtml: shared.processTitleHtml(shared.escapeHtml(post.title)),
        desktopTitleSingleLine: desktopTitleLayout ? desktopTitleLayout.singleLine : undefined,
        desktopPreviewLines: desktopTitleLayout ? desktopTitleLayout.previewLines : undefined,
        excerptHtml: shared.escapeHtmlWithLineBreaks(previewText),
        date: post.date.tz('Asia/Shanghai').format('YYYY-MM-DD'),
        modifiedDate: post.modifiedDate.tz('Asia/Shanghai').format('YYYY-MM-DD'),
        sortDate: post.date.valueOf(),
        sortModifiedDate: post.modifiedDate.valueOf(),
        tagsHtml,
        cover: post.cover,
        coverWidth: post.coverWidth,
        coverHeight: post.coverHeight,
        pinned: post.pinned,
        animationDelay: getCardAnimationDelay(index, animationDelayStep),
        mobileTagsInline: ALL_PAGE_MOBILE_CARD_OPTIONS.mobileTagsInline,
        layout: cardOptions.layout
    });
}

function renderHomeSection({ eyebrow, title, description, actionHref, actionLabel, bodyHtml }) {
    const keyBase = String(eyebrow || '')
        .trim()
        .replace(/\s+([a-z])/gi, (_, char) => char.toUpperCase())
        .replace(/\s+/g, '');
    const sectionKey = keyBase ? keyBase.charAt(0).toLowerCase() + keyBase.slice(1) : '';
    const labelKey = sectionKey ? ` data-i18n="home.${sectionKey}Label"` : '';
    const titleKey = sectionKey ? ` data-i18n="home.${sectionKey}Title"` : '';
    const descriptionKey = sectionKey ? ` data-i18n="home.${sectionKey}Description"` : '';
    const actionKey = sectionKey && actionLabel ? ` data-i18n="home.${actionLabel.replace(/\s+(\w)/g, (_, char) => char.toUpperCase()).replace(/\s+/g, '').replace(/^View/, 'view')}"` : '';

    return `
        <section class="home-content-section rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6">
            <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div class="min-w-0">
                    <p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary"${labelKey}>${shared.escapeHtml(eyebrow)}</p>
                    <h2 class="text-xl font-semibold text-slate-900 dark:text-white"${titleKey}>${shared.escapeHtml(title)}</h2>
                    ${description ? `<p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400"${descriptionKey}>${shared.escapeHtml(description)}</p>` : ''}
                </div>
                ${actionHref && actionLabel ? `<a class="home-section-link inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary" href="${shared.escapeHtml(actionHref)}"><span${actionKey}>${shared.escapeHtml(actionLabel)}</span> <span aria-hidden="true">→</span></a>` : ''}
            </div>
            ${bodyHtml}
        </section>
    `;
}

function renderProjectSummary(project) {
    const href = `/projects/${encodeURIComponent(project.id)}/`;
    return `
        <a class="home-project-item block border-t border-slate-100 py-4 transition hover:opacity-90 dark:border-slate-800" href="${shared.escapeHtml(href)}">
            <div class="flex gap-4">
                ${project.cover ? `<img class="h-20 w-28 shrink-0 rounded-lg object-cover" src="${shared.escapeHtml(project.cover)}" alt="${shared.escapeHtml(project.title)}" loading="lazy" decoding="async">` : ''}
                <div class="min-w-0">
                    <div class="mb-2 flex flex-wrap gap-2 text-[11px]">
                        <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">${shared.escapeHtml(project.categoryLabel || '项目')}</span>
                        <span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500 dark:bg-slate-800 dark:text-slate-300">${shared.escapeHtml(project.statusLabel || project.status || '')}</span>
                    </div>
                    <h3 class="line-clamp-2 text-sm font-semibold leading-6 text-slate-900 dark:text-white">${shared.escapeHtml(project.title)}</h3>
                    <p class="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">${shared.escapeHtml(project.description || project.summary || '暂无项目说明。')}</p>
                </div>
            </div>
        </a>
    `;
}

function renderSelectedProjects(projects = []) {
    const visible = projects.filter(Boolean).slice(0, 3);
    const bodyHtml = visible.length
        ? `<div class="grid gap-3">${visible.map(renderProjectSummary).join('\n')}</div>`
        : `<p class="text-sm leading-6 text-slate-500 dark:text-slate-400" data-i18n="home.selectedProjectsEmpty">精选项目区域已预留。等你发布真实项目后，这里会自动显示。</p>`;

    return renderHomeSection({
        eyebrow: 'Selected Projects',
        title: '精选项目',
        description: '展示你参与过、正在推进或值得复盘的项目记录。',
        actionHref: '/projects/',
        actionLabel: 'View Projects',
        bodyHtml
    });
}

function renderRecentPhotos(photos = []) {
    const visible = photos.filter(Boolean).slice(0, 6);
    const bodyHtml = visible.length
        ? `<div class="home-photo-grid grid grid-cols-2 gap-3 sm:grid-cols-3">
                ${visible.map((photo) => `
                    <a class="block overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800" href="${shared.escapeHtml(photo.href || '/gallery/')}" aria-label="${shared.escapeHtml(photo.title || photo.alt || 'View gallery album')}">
                        <img class="aspect-square w-full object-cover transition duration-200 hover:scale-[1.03]" src="${shared.escapeHtml(photo.cover || photo.image)}" alt="${shared.escapeHtml(photo.alt || photo.title || 'Gallery album')}" loading="lazy" decoding="async">
                    </a>
                `).join('\n')}
            </div>`
        : `<p class="text-sm leading-6 text-slate-500 dark:text-slate-400" data-i18n="home.recentPhotosEmpty">最近照片区域已预留。上传图库图片并发布后，这里会自动显示最近照片。</p>`;

    return renderHomeSection({
        eyebrow: 'Recent Photos',
        title: '最近照片',
        description: '轻量展示最近上传的项目、工作和生活照片。',
        actionHref: '/gallery/',
        actionLabel: 'View Gallery',
        bodyHtml
    });
}

function renderHomeContentSections({ projects = [], photos = [] }) {
    return [
        renderSelectedProjects(projects),
        renderRecentPhotos(photos)
    ].join('\n');
}

function generateAll({ posts, template, postsPerPage, siteConfig, seoConfig, outputDir, recentPostsSidebarHtml, homeProjects = [], homePhotos = [], socialLinksHtml = '' }) {
    const totalPages = postsPerPage === 0 ? 1 : Math.ceil(posts.length / postsPerPage);

    for (let page = 1; page <= totalPages; page++) {
        const start = (page - 1) * postsPerPage;
        const pagePosts = postsPerPage === 0 ? posts : posts.slice(start, start + postsPerPage);

        const postsHtml = pagePosts.map(renderPostCardForList).join('');
        const paginationBtns = generatePaginationHtml(page, totalPages);
        const title = page === 1
            ? (siteConfig.site_title || siteConfig.site_name || 'FreeCat Blog')
            : `${siteConfig.site_title || siteConfig.site_name || 'FreeCat Blog'} - Page ${page}`;
        const canonicalPath = page === 1 ? '/' : `/page/${page}/`;
        // 分页页（page > 1）打 noindex,follow：让爬虫顺着链接发现文章页本身,
        // 但不让分页页与首页产生重复内容信号互相稀释排名。
        const isPagination = page > 1;
        const pagination = isPagination
            ? {
                prevUrl: seo.pageUrl(siteConfig, page === 2 ? '/' : `/page/${page - 1}/`),
                nextUrl: page < totalPages ? seo.pageUrl(siteConfig, `/page/${page + 1}/`) : ''
            }
            : (totalPages > 1 ? { nextUrl: seo.pageUrl(siteConfig, '/page/2/') } : null);
        const seoHead = seo.renderHeadTags({
            title,
            description: seo.defaultDescription(siteConfig, seoConfig),
            canonicalPath,
            siteConfig,
            seoConfig,
            image: seo.defaultImage(siteConfig, seoConfig),
            noindex: isPagination,
            pagination
        });
        const jsonLd = page === 1 ? seo.renderWebsiteJsonLd({ siteConfig, seoConfig }) : '';

        const outputHtml = replacePlaceholders(template, [
            [/<title>[\s\S]*?<\/title>/, `<title>${shared.escapeHtml(title)}</title>`],
            ['<!-- HOME_SEO_HEAD -->', seoHead],
            ['<!-- HOME_JSONLD -->', jsonLd],
            ['<!-- POSTS_LIST_PLACEHOLDER -->', postsHtml],
            ['<!-- HOME_CONTENT_SECTIONS -->', renderHomeContentSections({ projects: homeProjects, photos: homePhotos })],
            ['<!-- PAGINATION_BUTTONS_PLACEHOLDER -->', paginationBtns],
            ['<!-- PAGINATION_PLACEHOLDER -->', ''],
            ['<!-- RECENT_POSTS_SIDEBAR_PLACEHOLDER -->', recentPostsSidebarHtml || '']
        ]);

        if (page === 1) {
            // 首页内容同一份 HTML 落两个地址：
            //   /     (index.html) —— 站点规范首页，内容直出，爬虫与无 JS 访客直接读到文章列表；
            //   /home (home.html)  —— 外壳 iframe 的默认内容页，canonical 归并到 /。
            // 真人浏览器访问任一地址时，由 SHELL_BOOTSTRAP_SCRIPT 换壳升级为外壳（顶栏音频无缝）体验。
            fs.writeFileSync(path.join(outputDir, 'index.html'), outputHtml, 'utf-8');
            fs.writeFileSync(path.join(outputDir, 'home.html'), outputHtml, 'utf-8');
        } else {
            const pageDir = path.join(outputDir, 'page', String(page));
            if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
            fs.writeFileSync(path.join(pageDir, 'index.html'), outputHtml, 'utf-8');
        }
    }
}

module.exports = { generateAll, renderPostCardForList };
