# Light Blog Content Architecture

## Source Folders

- Blog posts: `content/posts`
- Projects: `content/projects`
- Photo gallery: `content/gallery`
- Shared social links: `content/config/social-links.json`
- UI translations: `content/config/locales/*.json`
- Uploaded images: `public/uploads/YYYY/MM`
- Future Pages CMS config: `.pages.yml`
- Legacy template content: `writing`, `projects`, `videos`, and `gallery` are kept as references, but new public content should use `content`.

## Publishing Flow

1. Add or edit a Markdown/MDX file in `content/posts`, `content/projects`, or `content/gallery`.
2. Put images in `public/uploads/YYYY/MM`.
3. Reference images with `/uploads/YYYY/MM/file-name.jpg`.
4. Add a YouTube URL or Video ID in the `youtube` frontmatter field.
5. Commit the changes to GitHub.
6. Cloudflare Pages rebuilds the site from the `all` directory.

## Multilingual Content

Fixed UI text is translated from `content/config/locales`. Blog and project
body content is not machine translated.

For future manual translations, keep matching `translation_key` values:

- `content/posts/zh-CN/light-first-blog.mdx`
- `content/posts/en-GB/light-first-blog.mdx`
- `content/projects/zh-CN/light-blog-content-system.mdx`
- `content/projects/en-GB/light-blog-content-system.mdx`

Each translated file should include:

```yaml
locale: zh-CN
translation_key: light-first-blog
```

If a matching language version does not exist, the site should show the
available original/default language version as fallback. It should not call an
automatic translation API.

## Future Admin

The future `/admin` backend should write only Git-tracked files:

- Markdown/MDX content under `content/posts` and `content/projects`
- Simple photo records under `content/gallery`
- Images under `public/uploads/YYYY/MM`
- Shared social links under `content/config/social-links.json`

The admin should authenticate with GitHub and create commits through the GitHub API. Cloudflare Pages should remain a static deployment target.

`.pages.yml` is already prepared as a Git-based CMS schema draft. It maps posts, projects, uploads, and social links to the same source folders used by the build.
