const path = require('path');
const fs = require('fs');

const CONTENT_FILE_EXTENSIONS = new Set([
    '.md',
    '.markdown',
    '.mdx',
    '.mdown',
    '.mkd',
    '.mkdn',
    '.txt',
    '.text'
]);

const MARKDOWN_FILE_EXTENSIONS = new Set([
    '.md',
    '.markdown',
    '.mdx',
    '.mdown',
    '.mkd',
    '.mkdn'
]);

function contentFileExtension(file) {
    return path.extname(String(file || '')).toLowerCase();
}

function isContentFile(file) {
    return CONTENT_FILE_EXTENSIONS.has(contentFileExtension(file));
}

function isMarkdownContentFile(file) {
    return MARKDOWN_FILE_EXTENSIONS.has(contentFileExtension(file));
}

function contentFileSlug(file) {
    return path.basename(file, path.extname(file));
}

function listContentFiles(dir) {
    const files = [];

    function walk(currentDir, relativeDir = '') {
        if (!fs.existsSync(currentDir)) return;

        fs.readdirSync(currentDir, { withFileTypes: true })
            .forEach((entry) => {
                const name = typeof entry === 'string' ? entry : entry.name;
                let isDirectory = false;
                let isFile = true;

                if (typeof entry === 'string') {
                    try {
                        const stats = fs.statSync(path.join(currentDir, name));
                        isDirectory = stats.isDirectory();
                        isFile = stats.isFile();
                    } catch (error) {
                        isDirectory = false;
                        isFile = true;
                    }
                } else {
                    isDirectory = entry.isDirectory();
                    isFile = entry.isFile();
                }
                const relativePath = relativeDir
                    ? path.join(relativeDir, name)
                    : name;
                const absolutePath = path.join(currentDir, name);

                if (isDirectory) {
                    walk(absolutePath, relativePath);
                    return;
                }

                if (isFile && isContentFile(name)) {
                    files.push(relativePath);
                }
            });
    }

    walk(dir);
    return files.sort();
}

module.exports = {
    CONTENT_FILE_EXTENSIONS,
    MARKDOWN_FILE_EXTENSIONS,
    contentFileExtension,
    isContentFile,
    isMarkdownContentFile,
    contentFileSlug,
    listContentFiles
};
