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

function renderResumeMarkdown(content) {
    const source = String(content || '');
    const { headings } = extractHeadingsAndGenerateTOC(source);

    let html = parseMarkdown(source, {
        enableImageCaptions: true,
        markMarkdownHeadings: true
    });

    html = addHeadingIds(html, headings);
    html = autoSpacingHtml(html);
    html = applyParagraphAlignment(html);

    return html;
}

function renderLocation(location) {
    const value = String(location || '').trim();

    if (!value) {
        return '';
    }

    return `
        <span class="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            ${shared.escapeHtml(value)}
        </span>
    `;
}

function renderEmail(email) {
    const value = String(email || '').trim();

    if (!value) {
        return '';
    }

    return `
        <a
            class="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 transition hover:text-primary dark:bg-slate-800 dark:text-slate-300"
            href="mailto:${shared.escapeHtml(value)}"
        >
            联系邮箱
        </a>
    `;
}

function renderDownload(data) {
    const enabled = data.show_resume_download === true;
    const file = String(data.resume_file || '').trim();

    if (!enabled || !file) {
        return '';
    }

    return `
        <a
            class="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm text-white transition hover:opacity-90"
            href="${shared.escapeHtml(file)}"
            download
        >
            下载简历
        </a>
    `;
}

function generate({
    template,
    siteConfig,
    seoConfig,
    resumePath,
    outputDir
}) {
    console.log('📄 Generating resume page...');

    if (!fs.existsSync(resumePath)) {
        console.log('  Resume profile not found, skipping.');
        return;
    }

    const raw = fs.readFileSync(resumePath, 'utf-8');
    const { data, content } = matter(raw);

    const name =
        String(data.name || siteConfig.site_name || 'Light').trim();

    const headline =
        String(data.headline || siteConfig.hero_subtitle || '').trim();

    const avatar =
        String(data.avatar || siteConfig.hero_avatar || '').trim();

    const pageTitle =
        `个人履历 - ${siteConfig.site_title || siteConfig.site_name || 'FreeCat Blog'}`;

    const canonicalPath = '/resume';

    const seoHead = seo.renderHeadTags({
        title: pageTitle,
        description:
            headline ||
            seo.defaultDescription(siteConfig, seoConfig),
        canonicalPath,
        siteConfig,
        seoConfig,
        image:
            avatar ||
            seo.defaultImage(siteConfig, seoConfig)
    });

    const resumeHtml = renderResumeMarkdown(content);

    const html = replacePlaceholders(template, [
        ['<!-- RESUME_SEO_HEAD -->', seoHead],
        [/<!-- RESUME_NAME -->/g, shared.escapeHtml(name)],
        [/<!-- RESUME_HEADLINE -->/g, shared.escapeHtml(headline)],
        [/<!-- RESUME_AVATAR -->/g, shared.escapeHtml(avatar)],
        ['<!-- RESUME_LOCATION -->', renderLocation(data.location)],
        ['<!-- RESUME_EMAIL -->', renderEmail(data.email)],
        ['<!-- RESUME_DOWNLOAD -->', renderDownload(data)],
        ['<!-- RESUME_CONTENT -->', resumeHtml]
    ]);

    fs.writeFileSync(
        path.join(outputDir, 'resume.html'),
        html,
        'utf-8'
    );

    console.log('  Generated: resume.html');
}

module.exports = { generate };
