import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG_PATH = path.join(ROOT, 'automation', 'social-video-sync.config.json');

function required(name) {
    const value = String(process.env[name] || '').trim();
    if (!value) throw new Error(`Missing required environment variable: ${name}`);
    return value;
}

async function requestJson(url, options = {}) {
    const response = await fetch(url, options);
    const text = await response.text();
    if (!response.ok) throw new Error(`${response.status} ${url}: ${text.slice(0, 500)}`);
    const data = JSON.parse(text);
    if (data?.error?.code && data.error.code !== 'ok' && data.error.code !== 0) {
        throw new Error(`${data.error.code}: ${data.error.message || 'TikTok API error'}`);
    }
    return data;
}

export async function listTikTokVideos(config, token = required('TIKTOK_ACCESS_TOKEN')) {
    const fields = 'id,title,video_description,create_time,cover_image_url,share_url,embed_link,duration';
    const videos = [];
    let cursor;
    for (let page = 0; page < Number(config.maxPages || 3); page += 1) {
        const body = { max_count: 20 };
        if (cursor) body.cursor = cursor;
        const json = await requestJson(`https://open.tiktokapis.com/v2/video/list/?fields=${fields}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = json.data || {};
        videos.push(...(data.videos || []));
        if (!data.has_more) break;
        cursor = data.cursor;
    }
    return videos;
}

function safeSlug(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70);
}

function yamlString(value) {
    return JSON.stringify(String(value || ''));
}

export function formatDuration(seconds) {
    const total = Number(seconds || 0);
    if (!total) return '';
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

async function existingTikTokIds() {
    const ids = new Set();
    for (const name of await fs.readdir(path.join(ROOT, 'videos'))) {
        if (!/\.md$/i.test(name)) continue;
        const text = await fs.readFile(path.join(ROOT, 'videos', name), 'utf8');
        const explicit = text.match(/^tiktok_video_id:\s*["']?([^\r\n"']+)/m);
        if (explicit) ids.add(explicit[1].trim());
        const link = text.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
        if (link) ids.add(link[1]);
    }
    return ids;
}

async function downloadCover(url, videoId) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Unable to download TikTok cover for ${videoId}: ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    const extension = contentType.includes('png') ? 'png' : 'jpg';
    const dir = path.join(ROOT, 'all', 'image', 'videos', 'tiktok');
    await fs.mkdir(dir, { recursive: true });
    const filename = `${videoId}.${extension}`;
    await fs.writeFile(path.join(dir, filename), Buffer.from(await response.arrayBuffer()));
    return `/image/videos/tiktok/${filename}`;
}

export function renderMarkdown(video, cover, config) {
    const id = String(video.id);
    const title = String(video.title || video.video_description || `TikTok video ${id}`).trim();
    const date = new Date(Number(video.create_time) * 1000).toISOString().slice(0, 10);
    const slug = `tiktok-${id}`;
    const shareUrl = video.share_url || `https://www.tiktok.com/@${config.tiktokUsername}/video/${id}`;
    const embedUrl = `https://www.tiktok.com/player/v1/${id}`;
    return `---\nid: ${slug}\ntitle: ${yamlString(title)}\nplatform: tiktok\ncategory: project\ndate: ${date}\nupdated:\nduration: ${yamlString(formatDuration(video.duration))}\ncreator: ${yamlString(config.creator)}\nsource_url: ${yamlString(shareUrl)}\nembed_url: ${yamlString(embedUrl)}\ncover: ${yamlString(cover)}\nsummary: ${yamlString(title)}\ntags:\n- TikTok\n- THT\n- SMT 自动化\nrelated_projects:\nrelated_articles:\nfeatured: false\nshow: true\ntiktok_video_id: ${yamlString(id)}\n---\n\n# 视频介绍\n\n${title}\n\n## 视频来源\n\n本视频自动同步自 TikTok 官方账号 @${config.tiktokUsername}。\n`;
}

export async function syncVideos() {
    const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'));
    const [videos, known] = await Promise.all([listTikTokVideos(config), existingTikTokIds()]);
    let created = 0;
    for (const video of videos.sort((a, b) => Number(a.create_time) - Number(b.create_time))) {
        const id = String(video.id || '');
        if (!id || known.has(id)) continue;
        if (!video.cover_image_url) {
            console.log(`Skipped ${id}: TikTok did not return a cover.`);
            continue;
        }
        const cover = await downloadCover(video.cover_image_url, id);
        const output = path.join(ROOT, 'videos', `tiktok-${safeSlug(id)}.md`);
        await fs.writeFile(output, renderMarkdown(video, cover, config), { flag: 'wx' });
        known.add(id);
        created += 1;
        console.log(`Created videos/${path.basename(output)}`);
    }
    console.log(`TikTok sync complete. Created ${created} video(s).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    syncVideos().catch((error) => {
        console.error(error.stack || error.message);
        process.exitCode = 1;
    });
}
