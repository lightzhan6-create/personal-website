# TikTok 视频自动同步

该任务每小时读取一次 `@kevinthtautomation` 的公开视频。发现新视频后，自动下载 TikTok 官方封面、生成博客视频条目并提交到 GitHub。封面会保存到仓库，因此不受 TikTok 临时封面 URL 过期影响。

## TikTok 授权

1. 在 TikTok for Developers 创建应用。
2. 启用 Login Kit 和 Display API。
3. 申请 `user.info.basic` 和 `video.list`。
4. 使用 `@kevinthtautomation` 完成 OAuth 授权。
5. 将获得的 access token 保存为 GitHub Repository secret：`TIKTOK_ACCESS_TOKEN`。

不要把 Client Secret、access token 或 refresh token 写入文件或发送到聊天中。

## 启用定时任务

在 GitHub 仓库 **Settings → Secrets and variables → Actions → Variables** 中添加：

- `SOCIAL_VIDEO_SYNC_ENABLED` = `true`

然后进入 **Actions → Sync TikTok videos → Run workflow** 手动运行一次。成功后任务会在每小时第 17 分钟运行。

## Token 有效期

TikTok access token 通常约 24 小时有效。当前工作流在 Token 失效时会安全失败，不会生成错误内容。长期无人值守运行需要安全保存 refresh token，并在服务端刷新 access token；refresh token 不应提交到 GitHub 仓库。

## 去重

每个自动生成的 Markdown 文件都会保存 `tiktok_video_id`。同步程序还会识别已有 TikTok 链接中的视频 ID，因此不会重复创建已手工添加的视频。
