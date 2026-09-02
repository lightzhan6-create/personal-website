import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDuration, renderMarkdown } from './social-video-sync.mjs';

test('formats TikTok duration', () => {
    assert.equal(formatDuration(125), '2:05');
    assert.equal(formatDuration(0), '');
});

test('renders a self-contained TikTok video entry', () => {
    const text = renderMarkdown({
        id: '123456789', title: 'Manual THT insertion', create_time: 1788307200,
        duration: 42, share_url: 'https://www.tiktok.com/@light/video/123456789'
    }, '/image/videos/tiktok/123456789.jpg', {
        tiktokUsername: 'light', creator: 'Light'
    });
    assert.match(text, /platform: tiktok/);
    assert.match(text, /duration: "0:42"/);
    assert.match(text, /tiktok_video_id: "123456789"/);
    assert.match(text, /cover: "\/image\/videos\/tiktok\/123456789.jpg"/);
});
