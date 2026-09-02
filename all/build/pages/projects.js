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
    lead: '主导项目',
    collaborative: '协作项目',
    solution: '解决方案'
};

const STATUS_LABELS = {
    draft: '草稿',
    ongoing: '进行中',
    completed: '已完成',
    archived: '已归档'
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

function loadProjects(projectsDir) {
    if (!fs.existsSync(projectsDir)) {
        console.log('  Projects directory not found.');
        return [];
    }

    const files = fs.readdirSync(projectsDir)
        .filter((name) => /\.(md|markdown)$/i.test(name));

    const projects = [];
    const usedIds = new Set();

    files.forEach((filename) => {
        const filePath = path.join(projectsDir, filename);
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(raw);

        if (data.show === false) {
            console.log(`  Skipping hidden project: ${filename}`);
            return;
        }

        const id = normalizeId(data.id, filename);

        if (!id) {
            throw new Error(
                `Project "${filename}" requires a valid English id.`
            );
        }

        if (usedIds.has(id)) {
            throw new Error(`Duplicate project id: ${id}`);
        }

        usedIds.add(id);

        const category = CATEGORY_LABELS[data.category]
            ? data.category
            : 'collaborative';

        const status = STATUS_LABELS[data.status]
            ? data.status
            : 'draft';

        projects.push({
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
            status,
            statusLabel: STATUS_LABELS[status],
            role: String(data.role || '未填写').trim(),
            cover: String(data.cover || '').trim(),
            summary: String(data.summary || '').trim(),
            featured: data.featured === true,

            relatedArticles: normalizeStringArray(
                data.related_articles
            ),

            relatedVideos: normalizeStringArray(
                data.related_videos
            ),

            relatedGallery: normalizeStringArray(
                data.related_gallery
            ),

            relatedProjects: normalizeStringArray(
                data.related_projects
            ),

            content
        });
    });

    projects.sort((a, b) => {
        if (a.featured !== b.featured) {
            return a.featured ? -1 : 1;
        }

        return String(b.date).localeCompare(String(a.date));
    });

    return projects;
}

function renderCategoryBadge(project) {
    return `
        <span
            class="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
        >
            ${escape(project.categoryLabel)}
        </span>
    `;
}

function renderStatusBadge(project) {
    return `
        <span
            class="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        >
            ${escape(project.statusLabel)}
        </span>
    `;
}

function renderFeaturedBadge(project) {
    if (!project.featured) {
        return '';
    }

    return `
        <span
            class="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
        >
            精选项目
        </span>
    `;
}

function renderProjectCover(project) {
    if (!project.cover) {
        return `
            <div
                class="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-slate-400 dark:from-slate-800 dark:to-slate-900 dark:text-slate-500"
            >
                暂无项目封面
            </div>
        `;
    }

    return `
        <img
            src="${escape(project.cover)}"
            alt="${escape(project.title)}"
            class="aspect-[16/9] w-full object-cover"
            loading="lazy"
            decoding="async"
        >
    `;
}

function renderProjectCard(project) {
    const projectUrl =
        `/projects/${encodeURIComponent(project.id)}/`;

    return `
        <article
            class="project-card overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            data-project-category="${escape(project.category)}"
        >
            <a href="${projectUrl}" class="block">
                ${renderProjectCover(project)}

                <div class="p-6">
                    <div class="mb-4 flex flex-wrap gap-2">
                        ${renderCategoryBadge(project)}
                        ${renderStatusBadge(project)}
                        ${renderFeaturedBadge(project)}
                    </div>

                    <h2
                        class="mb-3 text-xl font-semibold leading-snug text-slate-900 dark:text-white"
                    >
                        ${escape(project.title)}
                    </h2>

                    <p
                        class="mb-5 line-clamp-3 text-sm leading-7 text-slate-500 dark:text-slate-400"
                    >
                        ${escape(project.summary || '暂无项目摘要。')}
                    </p>

                    <dl
                        class="mb-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-800"
                    >
                        <div>
                            <dt class="mb-1 text-slate-400">
                                项目时间
                            </dt>

                            <dd class="text-slate-600 dark:text-slate-300">
                                ${escape(project.date)}
                            </dd>
                        </div>

                        <div>
                            <dt class="mb-1 text-slate-400">
                                承担角色
                            </dt>

                            <dd class="text-slate-600 dark:text-slate-300">
                                ${escape(project.role)}
                            </dd>
                        </div>
                    </dl>

                    <span
                        class="inline-flex items-center gap-2 text-sm font-medium text-primary"
                    >
                        查看项目
                        <span aria-hidden="true">→</span>
                    </span>
                </div>
            </a>
        </article>
    `;
}

function renderProjectMarkdown(project) {
    const { toc, headings } =
        extractHeadingsAndGenerateTOC(project.content);

    let html = parseMarkdown(project.content, {
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

function renderDetailCover(project) {
    if (!project.cover) {
        return '';
    }

    return `
        <img
            src="${escape(project.cover)}"
            alt="${escape(project.title)}"
            class="max-h-[560px] w-full object-cover"
            loading="eager"
            decoding="async"
        >
    `;
}

function renderRelatedArticles(project) {
    if (!project.relatedArticles.length) {
        return '<p>暂未关联文章。</p>';
    }

    const items = project.relatedArticles
        .map((articlePath) => {
            const safePath = String(articlePath || '').trim();
            const href = safePath.startsWith('/')
                ? safePath
                : `/${safePath}`;

            return `
                <li>
                    <a
                        href="${escape(href)}"
                        class="text-primary hover:underline"
                    >
                        ${escape(articlePath)}
                    </a>
                </li>
            `;
        })
        .join('');

    return `<ul class="space-y-2">${items}</ul>`;
}

function renderRelatedVideos(project) {
    if (!project.relatedVideos.length) {
        return '<p>暂未关联视频。</p>';
    }

    const items = project.relatedVideos
        .map((videoId) => {
            const safeId = encodeURIComponent(videoId);

            return `
                <li>
                    <a
                        href="/videos/${safeId}/"
                        class="text-primary hover:underline"
                    >
                        ${escape(videoId)}
                    </a>
                </li>
            `;
        })
        .join('');

    return `<ul class="space-y-2">${items}</ul>`;
}

function renderRelatedGallery(project) {
    if (!project.relatedGallery.length) {
        return '<p>暂未关联图片。</p>';
    }

    const items = project.relatedGallery
        .map((galleryId) => {
            const safeId = encodeURIComponent(galleryId);

            return `
                <li>
                    <a
                        href="/gallery/${safeId}/"
                        class="text-primary hover:underline"
                    >
                        ${escape(galleryId)}
                    </a>
                </li>
            `;
        })
        .join('');

    return `<ul class="space-y-2">${items}</ul>`;
}

function renderRelatedProjects(project) {
    if (!project.relatedProjects.length) {
        return '<p>暂未关联其他项目。</p>';
    }

    const items = project.relatedProjects
        .filter((projectId) => projectId !== project.id)
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

    if (!items) {
        return '<p>暂未关联其他项目。</p>';
    }

    return `<ul class="space-y-2">${items}</ul>`;
}

function generateListPage({
    projects,
    template,
    siteConfig,
    seoConfig,
    outputDir
}) {
    const pageTitle =
        `项目 - ${
            siteConfig.site_title ||
            siteConfig.site_name ||
            'FreeCat Blog'
        }`;

    const canonicalPath = '/projects';

    const seoHead = seo.renderHeadTags({
        title: pageTitle,
        description:
            '记录主导项目、协作项目和实践中形成的解决方案。',
        canonicalPath,
        siteConfig,
        seoConfig,
        image: seo.defaultImage(siteConfig, seoConfig)
    });

    const itemsHtml = projects
        .map(renderProjectCard)
        .join('\n');

    const html = replacePlaceholders(template, [
        ['<!-- PROJECTS_SEO_HEAD -->', seoHead],
        ['<!-- PROJECTS_ITEMS -->', itemsHtml]
    ]);

    fs.writeFileSync(
        path.join(outputDir, 'projects.html'),
        html,
        'utf-8'
    );

    console.log('  Generated: projects.html');
}

function generateDetailPages({
    projects,
    template,
    siteConfig,
    seoConfig,
    outputDir
}) {
    const projectsOutputDir =
        path.join(outputDir, 'projects');

    fs.mkdirSync(projectsOutputDir, {
        recursive: true
    });

    projects.forEach((project) => {
        const rendered = renderProjectMarkdown(project);
        const projectPath = `/projects/${project.id}/`;

        const pageTitle =
            `${project.title} - ${
                siteConfig.site_title ||
                siteConfig.site_name ||
                'FreeCat Blog'
            }`;

        const seoHead = seo.renderHeadTags({
            title: pageTitle,
            description:
                project.summary ||
                seo.defaultDescription(siteConfig, seoConfig),
            canonicalPath: projectPath,
            siteConfig,
            seoConfig,
            image:
                project.cover ||
                seo.defaultImage(siteConfig, seoConfig),
            type: 'article',
            publishedTime: project.date,
            modifiedTime: project.updated
        });

        const html = replacePlaceholders(template, [
            ['<!-- PROJECT_SEO_HEAD -->', seoHead],
            [/<!-- PROJECT_TITLE -->/g, escape(project.title)],
            ['<!-- PROJECT_SUMMARY -->', escape(project.summary)],
            [
                '<!-- PROJECT_CATEGORY -->',
                renderCategoryBadge(project)
            ],
            [
                '<!-- PROJECT_STATUS -->',
                renderStatusBadge(project)
            ],
            [
                '<!-- PROJECT_FEATURED -->',
                renderFeaturedBadge(project)
            ],
            [
                '<!-- PROJECT_COVER -->',
                renderDetailCover(project)
            ],
            ['<!-- PROJECT_DATE -->', escape(project.date)],
            [
                '<!-- PROJECT_LOCATION -->',
                escape(project.location)
            ],
            ['<!-- PROJECT_ROLE -->', escape(project.role)],
            [
                '<!-- PROJECT_UPDATED -->',
                escape(project.updated)
            ],
            ['<!-- PROJECT_CONTENT -->', rendered.html],
            ['<!-- PROJECT_TOC -->', rendered.toc],
            [
                '<!-- PROJECT_RELATED_ARTICLES -->',
                renderRelatedArticles(project)
            ],
            [
                '<!-- PROJECT_RELATED_VIDEOS -->',
                renderRelatedVideos(project)
            ],
            [
                '<!-- PROJECT_RELATED_GALLERY -->',
                renderRelatedGallery(project)
            ],
            [
                '<!-- PROJECT_RELATED_PROJECTS -->',
                renderRelatedProjects(project)
            ]
        ]);

        const projectOutputDir =
            path.join(projectsOutputDir, project.id);

        fs.mkdirSync(projectOutputDir, {
            recursive: true
        });

        fs.writeFileSync(
            path.join(projectOutputDir, 'index.html'),
            html,
            'utf-8'
        );

        console.log(
            `  Generated: projects/${project.id}/index.html`
        );
    });
}

function generate({
    listTemplate,
    detailTemplate,
    siteConfig,
    seoConfig,
    projectsDir,
    outputDir
}) {
    console.log('Generating project pages...');

    const projects = loadProjects(projectsDir);

    generateListPage({
        projects,
        template: listTemplate,
        siteConfig,
        seoConfig,
        outputDir
    });

    generateDetailPages({
        projects,
        template: detailTemplate,
        siteConfig,
        seoConfig,
        outputDir
    });

    console.log(`  Published projects: ${projects.length}`);
}

module.exports = {
    loadProjects,
    generate
};
