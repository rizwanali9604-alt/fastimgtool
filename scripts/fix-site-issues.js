/**
 * Batch fix: canonical URL typos, markdown fences in tool content, homepage tool grid.
 * Run: node scripts/fix-site-issues.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function walk(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const st = fs.statSync(p);
        if (st.isDirectory()) {
            if (['node_modules', '.git', 'guides_backup'].includes(name)) continue;
            walk(p, out);
        } else if (name.endsWith('.html') || name.endsWith('.json') && dir.includes('data')) {
            out.push(p);
        }
    }
    return out;
}

function fixUrls(content) {
    return content
        .replace(/https:\/(?!\/)/g, 'https://')
        .replace(/http:\/(?!\/)/g, 'http://');
}

function stripMarkdownFences(text) {
    if (!text || typeof text !== 'string') return text;
    return text
        .replace(/```html?\s*/gi, '')
        .replace(/```\s*/g, '')
        .trim();
}

const TOOL_CARDS = [
    ['image-compressor', 'optimize', '🗜️', 'Image Compressor', 'Reduce file size without losing quality. Best for Meesho & Amazon sellers.'],
    ['image-resizer', 'transform', '↔️', 'Image Resizer', 'Resize to exact pixels. Presets for Meesho 600×600, Amazon, Instagram.'],
    ['jpg-to-png', 'convert', '🔄', 'JPG to PNG', 'Convert JPG images to PNG format instantly. Preserves transparency.'],
    ['png-to-jpg', 'convert', '🔄', 'PNG to JPG', 'Convert PNG to JPG with white background. Reduces file size.'],
    ['image-to-webp', 'convert', '⚡', 'Image to WebP', 'Convert to WebP for smaller files. Faster website loading.'],
    ['webp-to-jpg', 'convert', '🔄', 'WebP to JPG', 'Convert WebP images back to JPG format. Free and instant.'],
    ['image-blur', 'effects', '🌫️', 'Blur Image', 'Apply Gaussian blur effect. Blur backgrounds or entire images.'],
    ['image-sharpen', 'effects', '💎', 'Sharpen Image', 'Make blurry photos crisp and clear. Enhance product photos.'],
    ['image-brightness', 'effects', '☀️', 'Brightness', 'Adjust image brightness with live preview sliders.'],
    ['image-contrast', 'effects', '◑', 'Contrast', 'Adjust image contrast for sharper product photos.'],
    ['image-grayscale', 'effects', '⬛', 'Grayscale', 'Convert color images to black and white instantly.'],
    ['image-sepia', 'effects', '🟤', 'Sepia Effect', 'Apply warm vintage sepia tone to any image.'],
    ['image-invert', 'effects', '🔲', 'Invert Colors', 'Create negative effect by inverting all image colors.'],
    ['image-saturation', 'effects', '🎨', 'Saturation', 'Boost or reduce color saturation. Make colors pop.'],
    ['image-crop', 'transform', '✂️', 'Crop Image', 'Crop to exact dimensions. Presets for 1:1, 16:9, 4:3.'],
    ['rotate-image', 'transform', '🔄', 'Rotate Image', 'Rotate 90°, 180°, 270° or any custom angle.'],
    ['flip-image', 'transform', '🔃', 'Flip Image', 'Flip horizontally or vertically. Create mirror images.'],
    ['image-to-base64', 'convert', '📝', 'Image to Base64', 'Convert image to Base64 string for web developers.'],
    ['base64-to-image', 'convert', '🖼️', 'Base64 to Image', 'Decode Base64 string back to downloadable image.'],
    ['heic-to-jpg', 'convert', '📱', 'HEIC to JPG', 'Convert iPhone HEIC photos to JPG in your browser.'],
    ['bmp-to-jpg', 'convert', '🔄', 'BMP to JPG', 'Convert BMP images to JPG format instantly.'],
    ['gif-to-png', 'convert', '🎞️', 'GIF to PNG', 'Convert GIF (first frame) to PNG format.'],
    ['png-to-webp', 'convert', '⚡', 'PNG to WebP', 'Convert PNG to WebP for faster web loading.'],
    ['tiff-to-jpg', 'convert', '🔄', 'TIFF to JPG', 'Convert TIFF images to JPG for web and email.']
];

function buildToolsGridHtml() {
    return TOOL_CARDS.map(
        ([slug, cat, icon, name, desc]) =>
            `      <a href="/tools/${slug}/" class="tool-card" data-cat="${cat}">
        <div class="tool-icon">${icon}</div>
        <div class="tool-info">
          <div class="tool-name">${name}</div>
          <div class="tool-desc">${desc}</div>
        </div>
        <div class="tool-arrow">→</div>
      </a>`
    ).join('\n\n');
}

function patchIndexHtml() {
    const indexPath = path.join(ROOT, 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');
    html = fixUrls(html);

    const gridHtml = buildToolsGridHtml();
    const section = `        <section id="tools" class="section tools-section" style="padding-top:40px;">
            <div class="container">
                <div class="section-header">
                    <h2>All Image Tools</h2>
                    <p>24 free tools, works in browser, zero signup needed</p>
                </div>
                <div class="cat-tabs category-tabs">
                    <button type="button" class="cat-tab active" data-cat="all">All Tools</button>
                    <button type="button" class="cat-tab" data-cat="convert">Converters</button>
                    <button type="button" class="cat-tab" data-cat="optimize">Optimize</button>
                    <button type="button" class="cat-tab" data-cat="effects">Effects</button>
                    <button type="button" class="cat-tab" data-cat="transform">Transform</button>
                </div>
                <div class="tools-grid">
${gridHtml}
                </div>
            </div>
        </section>`;

    html = html.replace(
        /<section class="tools-section"[\s\S]*?<\/section>/,
        section
    );

    if (!html.includes('home-tool-tabs.js')) {
        html = html.replace(
            '</body>',
            '    <script src="/assets/js/home-tool-tabs.js"></script>\n</body>'
        );
    }

    fs.writeFileSync(indexPath, html);
    console.log('✅ Patched index.html tool grid');
}

function fixAllHtml() {
    const files = walk(ROOT).filter((f) => f.endsWith('.html'));
    let n = 0;
    for (const file of files) {
        const raw = fs.readFileSync(file, 'utf8');
        const fixed = fixUrls(raw);
        if (fixed !== raw) {
            fs.writeFileSync(file, fixed);
            n++;
        }
    }
    console.log(`✅ Fixed URLs in ${n} HTML files`);
}

function fixToolContentJson() {
    const p = path.join(ROOT, 'data', 'tool-content.json');
    if (!fs.existsSync(p)) return;
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    let changed = false;
    for (const key of Object.keys(data)) {
        const entry = data[key];
        for (const field of ['about', 'howTo', 'whyUse', 'useCases', 'faq']) {
            if (entry[field]) {
                const cleaned = stripMarkdownFences(entry[field]);
                if (cleaned !== entry[field]) {
                    entry[field] = cleaned;
                    changed = true;
                }
            }
        }
    }
    if (changed) {
        fs.writeFileSync(p, JSON.stringify(data, null, 2));
        console.log('✅ Cleaned markdown fences in tool-content.json');
    }
}

function fixTemplates() {
    const tplDir = path.join(ROOT, 'templates');
    for (const name of fs.readdirSync(tplDir)) {
        if (!name.endsWith('.html')) continue;
        const p = path.join(tplDir, name);
        const fixed = fixUrls(fs.readFileSync(p, 'utf8'));
        fs.writeFileSync(p, fixed);
    }
    console.log('✅ Fixed template URLs');
}

patchIndexHtml();
fixAllHtml();
fixToolContentJson();
fixTemplates();
console.log('Done.');
