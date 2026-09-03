# Content Structure

This folder is the long-term content source for Light's personal website.

## Folders

- `posts/`: blog posts and industry articles.
- `projects/`: customer projects, equipment projects, website projects, and AI workflow records.
- `gallery/`: simple photo records for the unified Photo Gallery.
- `config/`: shared content configuration such as social links.

## Frontmatter

Posts and projects share these fields:

```yaml
title: Page title
slug: stable-url-slug
date: 2026-09-02
updated: 2026-09-02
description: Short summary.
category: smt
tags:
  - SMT
cover: /uploads/2026/09/cover.jpg
gallery:
  - /uploads/2026/09/detail-01.jpg
author: Light
youtube: https://www.youtube.com/watch?v=VIDEO_ID
seo_title: SEO title
seo_description: SEO description
show: true
```

Use ASCII slugs such as `smt-feeder-notes` or `pcba-project-review`.

Gallery records are intentionally simpler:

```yaml
image: /uploads/2026/09/photo.jpg
title:
date:
description:
alt:
show: true
```

The repository also includes `.pages.yml` at the project root so a future Git-based CMS can read the same fields without changing the content model.
