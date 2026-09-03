function firstDefined(...values) {
    return values.find(value => value !== undefined && value !== null);
}

function toInteger(value) {
    const parsed = parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTags(value) {
    if (Array.isArray(value)) {
        return value.map(tag => String(tag == null ? '' : tag).trim()).filter(Boolean);
    }
    if (value == null || value === '') return [];
    const tag = String(value).trim();
    return tag ? [tag] : [];
}

function normalizeStringArray(value) {
    if (Array.isArray(value)) {
        return value.map(item => String(item == null ? '' : item).trim()).filter(Boolean);
    }
    if (value == null || value === '') return [];
    const item = String(value).trim();
    return item ? [item] : [];
}

function normalizePostTags(post = {}) {
    return normalizeTags(firstDefined(post.tags, post.tag, []));
}

function normalizePostFrontmatter(data = {}) {
    return {
        show: data.show,
        title: data.title,
        slug: data.slug || '',
        locale: data.locale || 'zh-CN',
        translationKey: firstDefined(data.translation_key, data.translationKey, data.slug, ''),
        description: data.description,
        summary: data.summary,
        category: data.category || '',
        date: data.date,
        updated: firstDefined(data.updated, data.date_updated),
        cover: data.cover || '',
        gallery: normalizeStringArray(data.gallery),
        youtube: normalizeStringArray(firstDefined(data.youtube, data.youtube_url, data.youtube_id)),
        coverWidth: toInteger(data.cover_width),
        coverHeight: toInteger(data.cover_height),
        tags: normalizeTags(firstDefined(data.tags, data.tag, [])),
        pinned: data.pinned === true,
        allowCopyContent: data.copy_content === true,
        showLatestUpdate: data.show_latest_update === true
            || data.showLatestUpdate === true,
        author: data.author || '',
        authorUrl: firstDefined(data.author_url, data.authorUrl, ''),
        seoTitle: firstDefined(data.seo_title, data.seoTitle, ''),
        seoDescription: firstDefined(data.seo_description, data.seoDescription, ''),
        noindex: data.noindex === true,
        faq: data.faq,
        enableImageCaptions: data.show_image_captions === true
            || data.enable_image_captions === true
            || data.enableImageCaptions === true
    };
}

module.exports = { normalizePostFrontmatter, normalizePostTags, normalizeStringArray };
