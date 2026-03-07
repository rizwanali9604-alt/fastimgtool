const fs = require('fs');
const path = require('path');

const GUIDE_DATA_FILE = path.join(__dirname, '..', 'data', 'guide-data.json');
const TEMPLATE_FILE = path.join(__dirname, '..', 'templates', 'guide-template.html');
const GUIDES_OUTPUT_DIR = path.join(__dirname, '..', 'guides');
const GUIDES_JSON_FILE = path.join(__dirname, '..', 'data', 'guides.json');

if (!fs.existsSync(GUIDES_OUTPUT_DIR)) {
    fs.mkdirSync(GUIDES_OUTPUT_DIR, { recursive: true });
}

const guideData = JSON.parse(fs.readFileSync(GUIDE_DATA_FILE, 'utf8'));
let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

const guidesJson = [];

guideData.forEach(guide => {
    const { tool_slug, tool_name, slug, title, description, h1, content } = guide;

    // Compute image path from slug
    const imagePath = `/assets/images/guides/${slug}.jpg`;

    let page = template
        .replace(/\{\{title\}\}/g, title)
        .replace(/\{\{description\}\}/g, description)
        .replace(/\{\{h1\}\}/g, h1)
        .replace(/\{\{content\}\}/g, content)
        .replace(/\{\{tool_slug\}\}/g, tool_slug)
        .replace(/\{\{tool_name\}\}/g, tool_name)
        .replace(/\{\{slug\}\}/g, slug)
        .replace(/\{\{image\}\}/g, imagePath);

    const outputPath = path.join(GUIDES_OUTPUT_DIR, `${slug}.html`);
    fs.writeFileSync(outputPath, page, 'utf8');
    console.log(`✅ Generated: guides/${slug}.html`);

    guidesJson.push({
        tool_slug: tool_slug,
        title: title,
        url: `/guides/${slug}.html`
    });
});

fs.writeFileSync(GUIDES_JSON_FILE, JSON.stringify(guidesJson, null, 2), 'utf8');
console.log(`📝 Updated: data/guides.json with ${guidesJson.length} guides`);
console.log(`\n🎉 Successfully generated ${guideData.length} guide pages.`);