---
title: Light 个人博客内容架构搭建
slug: light-blog-content-system
locale: zh-CN
translation_key: light-blog-content-system
date: 2026-09-02
updated: 2026-09-02
description: 为 Light 的个人博客建立长期可维护的 Markdown/MDX 内容结构，兼容未来 Git-based CMS。
category: website
tags:
  - 个人博客
  - 内容管理
  - GitHub
  - Cloudflare
cover: /uploads/2026/09/light-neutral-cover.svg
gallery:
  - /uploads/2026/09/light-neutral-cover.svg
author: Light
youtube:
seo_title: Light 个人博客内容架构搭建
seo_description: 为 Light 的个人博客建立长期可维护的 Markdown/MDX 内容结构，兼容未来 Git-based CMS。
status: ongoing
role: 内容架构与网站维护
location: China
featured: true
show: true
related_articles:
  - /posts/light-first-blog/
related_videos:
related_gallery:
related_projects:
---

# 项目背景

这个项目用于把个人博客从模板站整理成长期可维护的内容系统。

## 目标

1. 文章统一放在 `content/posts`。
2. 项目统一放在 `content/projects`。
3. 图片统一放在 `public/uploads/YYYY/MM`。
4. YouTube 视频只保存链接或 Video ID，不把 MP4 文件放进 GitHub。
5. 为未来增加可视化 `/admin` 内容后台预留结构。

## 当前状态

目前已经完成基础内容结构、统一 frontmatter 字段、社交链接配置、项目记录模板和本地构建验证。

## 后续计划

后续可以接入 Git-based CMS，让文章、项目、图片和 YouTube 链接都通过网页后台填写，然后自动提交到 GitHub。
