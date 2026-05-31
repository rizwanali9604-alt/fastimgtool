const fs = require('fs');
const path = require('path');

const GUIDE_DATA_FILE = path.join(__dirname, '..', 'data', 'guide-data.json');
const TEMPLATE_FILE = path.join(__dirname, '..', 'templates', 'guide-template.html');
const GUIDES_OUTPUT_DIR = path.join(__dirname, '..', 'guides');
const GUIDES_JSON_FILE = path.join(__dirname, '..', 'data', 'guides.json');

/** Base URL for canonical links (override with SITE_ORIGIN env if needed) */
const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://fastimgtool.com').replace(/\/$/, '');

if (!fs.existsSync(GUIDES_OUTPUT_DIR)) {
    fs.mkdirSync(GUIDES_OUTPUT_DIR, { recursive: true });
}

const guideDataMain = JSON.parse(fs.readFileSync(GUIDE_DATA_FILE, 'utf8'));
const extraFile = path.join(__dirname, '..', 'data', 'guide-data-extra.json');
let guideDataExtra = [];
if (fs.existsSync(extraFile)) {
    guideDataExtra = JSON.parse(fs.readFileSync(extraFile, 'utf8'));
}
const guideData = guideDataMain.concat(guideDataExtra);
const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

const guidesJson = [];

/**
 * Escape text for HTML attribute contexts (title, meta description, canonical).
 */
function escapeAttr(value) {
    if (value == null) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeHtml(value) {
    if (value == null) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Apply all known {{placeholders}} from guide-data.json.
 * Content is inserted as HTML (trusted source: your guide-data).
 */
function renderGuidePage(guide, tpl) {
    const tool_slug = guide.tool_slug ?? '';
    const tool_name = guide.tool_name ?? tool_slug;
    const slug = guide.slug ?? '';
    const title = guide.title ?? '';
    const description = guide.description ?? '';
    const h1 = guide.h1 ?? title;
    const content = guide.content ?? '';
    const canonical_url = `${SITE_ORIGIN}/guides/${slug}.html`;
    const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const read_time = Math.max(3, Math.min(15, Math.ceil(wordCount / 200)));
    const updated_date = guide.date || 'May 2026';

    const inline_cta =
        '<div class="inline-tool-cta">' +
        '<div class="cta-icon">🖼️</div>' +
        '<div class="cta-text"><strong>Try it free: ' +
        escapeHtml(tool_name) +
        '</strong>' +
        '<span>Use our browser-based tool — no signup</span></div>' +
        '<a href="/tools/' +
        tool_slug +
        '/" class="cta-btn">Use Tool →</a></div>';

    const map = new Map([
        ['{{content}}', content],
        ['{{inline_cta}}', inline_cta],
        ['{{title}}', escapeHtml(title)],
        ['{{meta_description}}', escapeAttr(description)],
        ['{{h1}}', escapeHtml(h1)],
        ['{{tool_slug}}', tool_slug],
        ['{{tool_name}}', escapeHtml(tool_name)],
        ['{{canonical_url}}', canonical_url],
        ['{{read_time}}', String(read_time)],
        ['{{updated_date}}', updated_date]
    ]);

    let page = tpl;
    const longestFirst = [...map.entries()].sort((a, b) => b[0].length - a[0].length);
    for (const [needle, value] of longestFirst) {
        page = page.split(needle).join(value);
    }

    const leftover = page.match(/\{\{[a-zA-Z0-9_]+\}\}/g);
    if (leftover && leftover.length) {
        console.warn(`⚠️  ${slug}: unreplaced placeholders: ${[...new Set(leftover)].join(', ')}`);
    }

    return page;
}

guideData.forEach(guide => {
    const { slug } = guide;
    if (!slug) {
        console.warn('⚠️  Skipping guide with missing slug:', guide.title || '(no title)');
        return;
    }

    const page = renderGuidePage(guide, template);

    const outputPath = path.join(GUIDES_OUTPUT_DIR, `${slug}.html`);
    fs.writeFileSync(outputPath, page, 'utf8');
    console.log(`✅ Generated: guides/${slug}.html`);

    guidesJson.push({
        tool_slug: guide.tool_slug,
        title: guide.title,
        url: `/guides/${slug}.html`
    });
});

fs.writeFileSync(GUIDES_JSON_FILE, JSON.stringify(guidesJson, null, 2), 'utf8');
console.log(`📝 Updated: data/guides.json with ${guidesJson.length} guides`);
console.log(`\n🎉 Successfully generated ${guidesJson.length} guide pages.`);
