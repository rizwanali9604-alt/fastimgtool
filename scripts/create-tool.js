#!/usr/bin/env node

/**
 * ToolForge Elite Auto Tool Generator (Manual Build)
 * Usage: node scripts/create-tool.js <tool-slug> [--description "Custom description"]
 */

const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '..', 'tools');
const DATA_FILE = path.join(__dirname, '..', 'data', 'tools.json');

function isValidSlug(slug) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function atomicWrite(filePath, data) {
    const tempPath = `${filePath}.tmp.${Date.now()}`;
    fs.writeFileSync(tempPath, data, 'utf8');
    fs.renameSync(tempPath, filePath);
}

function main() {
    try {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            console.error('\n❌ Error: Missing tool slug.');
            console.log('Usage: node scripts/create-tool.js <tool-slug> [--description "Your description"]\n');
            process.exit(1);
        }

        const slug = args[0];
        let description = `Free online ${slug.replace(/-/g, ' ')} tool. Fast, private, browser‑based.`;

        const descIndex = args.indexOf('--description');
        if (descIndex !== -1 && args[descIndex + 1]) {
            description = args[descIndex + 1];
        }

        if (!isValidSlug(slug)) {
            console.error('\n❌ Error: Invalid slug format. Use only lowercase letters, numbers, and hyphens.\n');
            process.exit(1);
        }

        const toolDir = path.join(TOOLS_DIR, slug);
        if (fs.existsSync(toolDir)) {
            console.error(`\n❌ Error: Folder tools/${slug} already exists.\n`);
            process.exit(1);
        }

        let tools = [];
        if (fs.existsSync(DATA_FILE)) {
            try {
                const raw = fs.readFileSync(DATA_FILE, 'utf8');
                tools = JSON.parse(raw);
                if (!Array.isArray(tools)) throw new Error('tools.json is not an array');
            } catch (err) {
                console.error('\n❌ Error: tools.json is corrupted.');
                console.error(`   ${err.message}\n`);
                process.exit(1);
            }
        }

        if (tools.some(t => t.slug === slug)) {
            console.error(`\n❌ Error: Slug "${slug}" already exists in tools.json.\n`);
            process.exit(1);
        }

        // Create folder
        fs.mkdirSync(toolDir, { recursive: true });
        console.log(`📁 Created folder: tools/${slug}`);

        // Create basic tool.js
        const toolJs = `// Tool logic for ${slug}
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

let image = new Image();

fileInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        image.src = event.target.result;
        image.onload = () => {
            preview.innerHTML = '';
            preview.appendChild(image);
        };
    };
    reader.readAsDataURL(file);
});

downloadBtn.addEventListener('click', function () {
    if (!image.src) {
        alert('Please upload an image first.');
        return;
    }
    // Replace with actual processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'processed.png';
    link.href = dataUrl;
    link.click();
});
`;
        fs.writeFileSync(path.join(toolDir, 'tool.js'), toolJs);
        console.log(`⚙️ Created: tools/${slug}/tool.js`);

        // Update tools.json
        const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const newTool = { slug, title, description };
        tools.push(newTool);
        atomicWrite(DATA_FILE, JSON.stringify(tools, null, 2) + '\n');
        console.log(`📝 Updated: data/tools.json`);

        console.log(`\n✅ Tool "${slug}" created successfully!`);
        console.log(`👉 Now run: node build.js`);
        console.log(`👉 Then test at: http://localhost:3000/tools/${slug}/\n`);

    } catch (err) {
        console.error('\n❌ Unexpected error:', err.message);
        process.exit(1);
    }
}

main();