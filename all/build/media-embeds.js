const shared = require('../shared/shared.js');

function isSafeAssetUrl(value) {
    const raw = String(value || '').trim();
    if (!raw) return false;
    if (/^\/(?!\/)/.test(raw)) return true;
    try {
        const url = new URL(raw);
        return url.protocol === 'https:' || url.protocol === 'http:';
    } catch (err) {
        return false;
    }
}

function extractYouTubeId(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

    try {
        const url = new URL(raw);
        const host = url.hostname.toLowerCase().replace(/^www\./, '');
        if (host === 'youtu.be') {
            const id = url.pathname.split('/').filter(Boolean)[0] || '';
            return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
        }
        if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'm.youtube.com') {
            const watchId = url.searchParams.get('v') || '';
            if (/^[A-Za-z0-9_-]{11}$/.test(watchId)) return watchId;
            const parts = url.pathname.split('/').filter(Boolean);
            const markerIndex = parts.findIndex(part => ['embed', 'shorts', 'live'].includes(part));
            const id = markerIndex >= 0 ? parts[markerIndex + 1] : '';
            return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : '';
        }
    } catch (err) {}

    return '';
}

function renderYouTubeEmbeds(youtube, title = 'YouTube video') {
    const items = Array.isArray(youtube) ? youtube : [youtube];
    const seen = new Set();
    const embeds = items
        .map(extractYouTubeId)
        .filter((id) => {
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
        })
        .map((id) => {
            const safeId = shared.escapeHtml(id);
            return `<figure class="freecat-youtube-embed">
                <iframe
                    src="https://www.youtube-nocookie.com/embed/${safeId}"
                    title="${shared.escapeHtml(title)}"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    referrerpolicy="strict-origin-when-cross-origin"
                ></iframe>
            </figure>`;
        });

    if (!embeds.length) return '';
    return `<section class="freecat-youtube-section" aria-label="YouTube video">
        ${embeds.join('\n        ')}
    </section>`;
}

function normalizeGalleryItem(item) {
    if (typeof item === 'string') {
        const src = item.trim();
        return src ? { src, alt: '', caption: '' } : null;
    }
    if (!item || typeof item !== 'object') return null;
    const src = String(item.src || item.url || item.image || '').trim();
    if (!src) return null;
    return {
        src,
        alt: String(item.alt || item.title || '').trim(),
        caption: String(item.caption || item.description || '').trim()
    };
}

function renderGallery(gallery, title = 'Gallery') {
    const items = (Array.isArray(gallery) ? gallery : [gallery])
        .map(normalizeGalleryItem)
        .filter(Boolean)
        .filter(item => isSafeAssetUrl(item.src));

    if (!items.length) return '';

    const images = items.map((item) => {
        const alt = item.alt || title;
        const caption = item.caption
            ? `<figcaption>${shared.escapeHtml(item.caption)}</figcaption>`
            : '';
        return `<figure>
            <img src="${shared.escapeHtml(item.src)}" alt="${shared.escapeHtml(alt)}" loading="lazy" decoding="async">
            ${caption}
        </figure>`;
    }).join('\n            ');

    return `<section class="freecat-content-gallery" aria-label="${shared.escapeHtml(title)} gallery">
            ${images}
        </section>`;
}

module.exports = {
    extractYouTubeId,
    isSafeAssetUrl,
    renderGallery,
    renderYouTubeEmbeds
};
