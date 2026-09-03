# Admin Placeholder

This folder reserves the architecture for a future visual content backend.

The future `/admin` UI should:

- Create and edit files in `content/posts` and `content/projects`.
- Create simple photo records in `content/gallery`.
- Upload images into `public/uploads/YYYY/MM`.
- Save social links in `content/config/social-links.json`.
- Store YouTube links or Video IDs in frontmatter.
- Commit every publish action to GitHub.

No production admin backend is implemented yet.

For the next stage, use `.pages.yml` as the first CMS schema. It is designed for a Git-based CMS that edits Markdown/MDX files and uploads images into `public/uploads`.
