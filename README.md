# Light Personal Website

A static personal website built with Astro. It keeps the existing Astro content
architecture, responsive layout, native CSS design system, RSS feed, sitemap,
tags, and optional author profiles.

## Commands

```bash
npm install
npm run dev
npm run build
```

The production build is written to `dist/`.

## Where to add content

- `src/pages/index.astro` — homepage copy.
- `src/consts.ts` — site title, description, navigation, and social links.
- `astro.config.ts` — canonical production URL used by sitemap and RSS.
- `src/content/blog/` — Markdown blog posts.
- `src/content/projects/` — Markdown project entries.
- `src/content/authors/` — optional author profiles used by blog posts.
- `public/` — favicon, web-manifest icons, and static social-sharing images.

## Blog post example

```md
---
title: "Post title"
description: "A concise description for search engines and social previews."
date: 2026-08-13
authors:
  - your-author-id
tags:
  - notes
---

Write your post here.
```

Create a matching author file at `src/content/authors/your-author-id.md`
before publishing a post.

## Project example

```md
---
name: "Project name"
description: "A concise description of the project."
link: "https://example.com"
tags: ["Astro"]
startDate: "2026-08-13"
---
```

The source template is licensed under MIT; retain the original `LICENSE` file.
