# Content Structure

This folder is the long-term content source for Light's personal website.

## Folders

- `posts/`: blog posts and industry articles.
- `projects/`: customer projects, equipment projects, website projects, and AI workflow records.
- `gallery/`: Gallery Albums / Photo Sets. Each entry represents one topic, project, site visit, or record, with multiple related images.
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

Gallery records are album-based. Use one Gallery entry for a related set of photos:

```yaml
title: JUKI PCB Conveyor Factory Test
slug: juki-pcb-conveyor-factory-test
date: 2026-09-02
description: Short summary for the album card.
cover: /uploads/2026/09/photo-01.jpg
images:
  - /uploads/2026/09/photo-01.jpg
  - /uploads/2026/09/photo-02.jpg
  - /uploads/2026/09/photo-03.jpg
alt: JUKI PCB conveyor factory test photo set
show: true
```

The repository also includes `.pages.yml` at the project root so a future Git-based CMS can read the same fields without changing the content model.
