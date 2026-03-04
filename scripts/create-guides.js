const fs = require('fs');
const path = require('path');

const GUIDE_DATA_FILE = path.join(__dirname, '..', 'data', 'guide-data.json');
const TEMPLATE_FILE = path.join(__dirname, '..', 'templates', 'guide-template.html');
const GUIDES_OUTPUT_DIR = path.join(__dirname, '..', 'guides');
const GUIDES_JSON_FILE = path.join(__dirname, '..', 'data', 'guides.json');

// Ensure output directory exists
if (!fs.existsSync(GUIDES_OUTPUT_DIR)) {
    fs.mkdirSync(GUIDES_OUTPUT_DIR, { recursive: true });
}

// Check if required files exist
if (!fs.existsSync(GUIDE_DATA_FILE)) {
    console.error('❌ Missing guide-data.json in data folder.');
    process.exit(1);
}
if (!fs.existsSync(TEMPLATE_FILE)) {
    console.error('❌ Missing guide-template.html in templates folder.');
    process.exit(1);
}

// Read guide data
let guideData;
try {
    guideData = JSON.parse(fs.readFileSync(GUIDE_DATA_FILE, 'utf8'));
} catch (err) {
    console.error('❌ Error parsing guide-data.json:', err.message);
    process.exit(1);
}

let template;
try {
    template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
} catch (err) {
    console.error('❌ Error reading guide template:', err.message);
    process.exit(1);
}

// This will hold the entries for guides.json
const guidesJson = [];
let successCount = 0;

guideData.forEach((guide, index) => {
    const { tool_slug, tool_name, slug, title, description, h1, content } = guide;

    // Basic validation
    if (!tool_slug || !tool_name || !slug || !title || !description || !h1 || !content) {
        console.warn(`⚠️ Skipping guide #${index+1}: missing required fields`);
        return;
    }

    // Replace placeholders
    let page = template
        .replace(/\{\{title\}\}/g, title)
        .replace(/\{\{description\}\}/g, description)
        .replace(/\{\{h1\}\}/g, h1)
        .replace(/\{\{content\}\}/g, content)
        .replace(/\{\{tool_slug\}\}/g, tool_slug)
        .replace(/\{\{tool_name\}\}/g, tool_name)
        .replace(/\{\{slug\}\}/g, slug);

    const outputPath = path.join(GUIDES_OUTPUT_DIR, `${slug}.html`);
    fs.writeFileSync(outputPath, page, 'utf8');
    console.log(`✅ Generated: guides/${slug}.html`);
    successCount++;

    // Add to guides.json entry
    guidesJson.push({
        tool_slug: tool_slug,
        title: title,
        url: `/guides/${slug}.html`
    });
});

// Write guides.json (overwrites existing)
fs.writeFileSync(GUIDES_JSON_FILE, JSON.stringify(guidesJson, null, 2), 'utf8');
console.log(`📝 Updated: data/guides.json with ${guidesJson.length} guides`);

console.log(`\n🎉 Successfully generated ${successCount} guide pages.`);
if (successCount < guideData.length) {
    console.warn(`⚠️ Skipped ${guideData.length - successCount} guides due to errors.`);
}