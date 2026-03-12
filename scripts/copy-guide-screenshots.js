// scripts/copy-guide-screenshots.js
const fs = require('fs').promises;
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '..', 'assets', 'images', 'tools');
const GUIDES_IMG_DIR = path.join(__dirname, '..', 'assets', 'images', 'guides');
const GUIDES_DATA = path.join(__dirname, '..', 'data', 'guide-data.json');

async function main() {
    console.log('\n📸 Copying tool screenshots to guides...\n');

    // Ensure guides image folder exists
    await fs.mkdir(GUIDES_IMG_DIR, { recursive: true });

    // Load guide data
    let guides;
    try {
        const raw = await fs.readFile(GUIDES_DATA, 'utf8');
        guides = JSON.parse(raw);
    } catch (err) {
        console.error('❌ Failed to read guide-data.json:', err.message);
        process.exit(1);
    }

    let copied = 0;
    for (const guide of guides) {
        const toolSlug = guide.tool_slug;
        const source = path.join(TOOLS_DIR, `${toolSlug}-screenshot.jpg`);
        const dest = path.join(GUIDES_IMG_DIR, `${guide.slug}.jpg`);

        try {
            await fs.access(source); // check if source exists
            await fs.copyFile(source, dest);
            console.log(`✅ Copied ${toolSlug} screenshot to ${guide.slug}.jpg`);
            copied++;
        } catch (err) {
            // source missing – skip silently (or print once per tool later)
        }
    }

    console.log(`\n📊 Done. Copied ${copied} screenshots.`);
}

main().catch(console.error);