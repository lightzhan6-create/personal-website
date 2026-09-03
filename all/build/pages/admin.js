const fs = require('fs');
const path = require('path');
const { replacePlaceholders } = require('../template-engine.js');
const seo = require('../seo.js');

function generate({ template, siteConfig, seoConfig, outputDir }) {
    console.log('🛠️ Generating admin placeholder...');

    const title = `Admin - ${siteConfig.site_title || siteConfig.site_name || 'FreeCat Blog'}`;
    const canonicalPath = '/admin';
    const seoHead = seo.renderHeadTags({
        title,
        description: 'Reserved admin entry for future Git-based content management.',
        canonicalPath,
        siteConfig,
        seoConfig,
        noindex: true,
        image: seo.defaultImage(siteConfig, seoConfig)
    });

    const html = replacePlaceholders(template, [
        ['<!-- ADMIN_SEO_HEAD -->', seoHead]
    ]);

    fs.writeFileSync(path.join(outputDir, 'admin.html'), html, 'utf-8');
    console.log('  Generated: admin.html');
}

module.exports = { generate };
