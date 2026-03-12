#!/usr/bin/env node
// scripts/ai-generate-guides.js
/**
 * AI Guide Generator – Elite Production Grade v3.0
 * 
 * Generates 5 high‑quality, SEO‑focused guides per tool using DeepSeek API.
 * Features:
 *   - Command‑line flags: --force, --dry-run
 *   - AI output validation (minimum length)
 *   - Exponential backoff retry logic
 *   - Rate‑limited requests
 *   - Detailed logging & summary
 *   - Automatic screenshot copying
 * 
 * Usage:
 *   node scripts/ai-generate-guides.js              # generate only missing guides
 *   node scripts/ai-generate-guides.js --force      # regenerate all guides
 *   node scripts/ai-generate-guides.js --dry-run    # preview what would be generated
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');

// ==================== Parse Arguments ====================
const args = process.argv.slice(2);
const FORCE_MODE = args.includes('--force');
const DRY_RUN = args.includes('--dry-run');

if (DRY_RUN) console.log('🔍 DRY RUN MODE – no changes will be saved.\n');

// ==================== Configuration & Validation ====================
const CONFIG = {
    apiKey: (() => {
        const key = process.env.DEEPSEEK_API_KEY;
        if (!key) {
            console.error('\n❌ DEEPSEEK_API_KEY not found in .env file.\n');
            process.exit(1);
        }
        return key;
    })(),
    model: 'deepseek/deepseek-chat',
    maxRetries: 3,
    retryDelay: 1000,
    rateLimitDelay: 2000,
    temperature: 0.8,
    maxTokens: 3000,
    minContentLength: 500,
    toolsFile: path.join(__dirname, '..', 'data', 'tools.json'),
    guidesFile: path.join(__dirname, '..', 'data', 'guide-data.json'),
    imagesToolDir: path.join(__dirname, '..', 'assets', 'images', 'tools'),
    imagesGuideDir: path.join(__dirname, '..', 'assets', 'images', 'guides'),
};

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: CONFIG.apiKey,
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==================== Retry with Exponential Backoff ====================
async function withRetry(fn, context) {
    for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            if (attempt === CONFIG.maxRetries) {
                console.error(`❌ [${context}] Failed after ${CONFIG.maxRetries} attempts:`, error.message);
                throw error;
            }
            const delay = CONFIG.retryDelay * Math.pow(2, attempt - 1);
            console.warn(`⚠️ [${context}] Attempt ${attempt} failed. Retrying in ${delay}ms...`);
            await sleep(delay);
        }
    }
}

// ==================== Guide Topic Definitions ====================
const CATEGORY_TOPICS = {
    resize: [
        { keyword: 'resize image for instagram', titleSuffix: 'for Instagram' },
        { keyword: 'resize image for facebook cover', titleSuffix: 'for Facebook Cover' },
        { keyword: 'resize image for youtube thumbnail', titleSuffix: 'for YouTube Thumbnail' },
        { keyword: 'resize image for email', titleSuffix: 'for Email' },
        { keyword: 'resize image without losing quality', titleSuffix: 'Without Losing Quality' },
    ],
    compression: [
        { keyword: 'compress image for email', titleSuffix: 'for Email' },
        { keyword: 'compress image for whatsapp', titleSuffix: 'for WhatsApp' },
        { keyword: 'compress image for website', titleSuffix: 'for Website' },
        { keyword: 'compress image without losing quality', titleSuffix: 'Without Losing Quality' },
        { keyword: 'best image compression settings', titleSuffix: 'Best Settings' },
    ],
    conversion: [
        { keyword: 'convert jpg to png', titleSuffix: 'JPG to PNG' },
        { keyword: 'convert png to jpg', titleSuffix: 'PNG to JPG' },
        { keyword: 'convert webp to jpg', titleSuffix: 'WEBP to JPG' },
        { keyword: 'convert heic to jpg', titleSuffix: 'HEIC to JPG' },
        { keyword: 'convert image to base64', titleSuffix: 'Image to Base64' },
    ],
    effects: [
        { keyword: 'apply blur to image', titleSuffix: 'Blur' },
        { keyword: 'sharpen image online', titleSuffix: 'Sharpen' },
        { keyword: 'convert image to grayscale', titleSuffix: 'Grayscale' },
        { keyword: 'invert image colors', titleSuffix: 'Invert' },
        { keyword: 'add sepia tone to image', titleSuffix: 'Sepia' },
    ],
    editing: [
        { keyword: 'crop image online', titleSuffix: 'Crop' },
        { keyword: 'rotate image', titleSuffix: 'Rotate' },
        { keyword: 'flip image horizontally', titleSuffix: 'Flip Horizontal' },
        { keyword: 'flip image vertically', titleSuffix: 'Flip Vertical' },
        { keyword: 'adjust image brightness', titleSuffix: 'Brightness' },
    ],
    default: [
        { keyword: 'how to use', titleSuffix: 'How to Use' },
        { keyword: 'tips and tricks', titleSuffix: 'Tips and Tricks' },
        { keyword: 'common mistakes', titleSuffix: 'Common Mistakes' },
        { keyword: 'best practices', titleSuffix: 'Best Practices' },
        { keyword: 'frequently asked questions', titleSuffix: 'FAQ' },
    ],
};

// ==================== AI Content Generation ====================
async function generateGuide(tool, topic) {
    const prompt = `Write a comprehensive, engaging guide about "${topic.keyword}" using the tool "${tool.title}". The guide should:
- Be around 1000 words.
- Include an introduction, clear steps, tips, and a conclusion.
- Naturally incorporate the keyword "${topic.keyword}" and related phrases.
- Mention the tool by name and link to it: <a href="/tools/${tool.slug}/">${tool.title}</a>.
- Output in HTML format with <h2>, <p>, <ul>, <li> tags. Do not include <html> or <body>.`;

    const content = await withRetry(async () => {
        const response = await openai.chat.completions.create({
            model: CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert content writer for an online image tools website. Write helpful, unique, and SEO‑friendly guides.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: CONFIG.temperature,
            max_tokens: CONFIG.maxTokens,
        });
        return response.choices[0].message.content.trim();
    }, `${tool.slug}-${topic.keyword}`);

    if (content.length < CONFIG.minContentLength) {
        throw new Error(`Generated content too short (${content.length} chars). Minimum required: ${CONFIG.minContentLength}`);
    }
    return content;
}

// ==================== Screenshot Handling ====================
async function copyScreenshot(toolSlug, guideSlug) {
    const source = path.join(CONFIG.imagesToolDir, `${toolSlug}-screenshot.jpg`);
    const dest = path.join(CONFIG.imagesGuideDir, `${guideSlug}.jpg`);

    try {
        await fs.access(source);
        await fs.copyFile(source, dest);
        return true;
    } catch (err) {
        console.warn(`   ⚠️ Could not copy screenshot for ${toolSlug} (source missing). Guide will have no image.`);
        return false;
    }
}

// ==================== Main Orchestrator ====================
async function main() {
    console.log('\n🚀 Starting AI Guide Generator (Elite Edition)\n');
    if (FORCE_MODE) console.log('⚡ Force mode: all guides will be regenerated.');
    if (DRY_RUN) console.log('🔍 Dry run: no files will be written.\n');

    if (!DRY_RUN) await fs.mkdir(CONFIG.imagesGuideDir, { recursive: true });

    // Load tools
    let tools;
    try {
        const rawTools = await fs.readFile(CONFIG.toolsFile, 'utf8');
        tools = JSON.parse(rawTools);
        console.log(`📦 Loaded ${tools.length} tools.`);
    } catch (err) {
        console.error('❌ Failed to read tools.json:', err.message);
        process.exit(1);
    }

    // Load existing guides
    let existingGuides = [];
    try {
        const rawGuides = await fs.readFile(CONFIG.guidesFile, 'utf8');
        existingGuides = JSON.parse(rawGuides);
        console.log(`📦 Loaded ${existingGuides.length} existing guides.`);
    } catch (err) {
        console.log('ℹ️ No existing guides file, will create new.');
    }
    const guidesMap = new Map(existingGuides.map(g => [g.slug, g]));

    const newGuides = [];
    const stats = { generated: 0, skipped: 0, failed: 0, imagesCopied: 0 };

    for (const tool of tools) {
        const category = tool.category || 'default';
        const topics = CATEGORY_TOPICS[category] || CATEGORY_TOPICS.default;
        console.log(`\n⚙️  Processing tool: ${tool.slug} (${tool.title})`);

        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];
            const slug = `${tool.slug}-guide-${i + 1}`;
            const title = `${tool.title} – ${topic.titleSuffix}`;
            const description = `Learn how to ${topic.keyword} with our free online tool. Fast, private, browser‑based.`;

            const exists = guidesMap.has(slug);
            if (exists && !FORCE_MODE) {
                console.log(`   ✅ Skipped (exists): ${slug}`);
                stats.skipped++;
                continue;
            }

            if (DRY_RUN) {
                console.log(`   🔍 Would generate: ${slug} (${title})`);
                stats.generated++;
                continue;
            }

            console.log(`   🧠 Generating: ${slug} (${title})`);
            try {
                const content = await generateGuide(tool, topic);
                const guide = {
                    slug,
                    title,
                    description,
                    tool_slug: tool.slug,
                    tool_name: tool.title,
                    h1: title,
                    content,
                    date: new Date().toISOString().split('T')[0],
                };
                newGuides.push(guide);
                guidesMap.set(slug, guide);
                stats.generated++;

                const copied = await copyScreenshot(tool.slug, slug);
                if (copied) stats.imagesCopied++;

            } catch (err) {
                console.error(`   ❌ Failed to generate guide for ${slug}: ${err.message}`);
                stats.failed++;
            }
            await sleep(CONFIG.rateLimitDelay);
        }
    }

    if (!DRY_RUN) {
        const allGuides = Array.from(guidesMap.values());
        await fs.writeFile(CONFIG.guidesFile, JSON.stringify(allGuides, null, 2), 'utf8');
        console.log(`\n📝 Saved ${allGuides.length} guides (${newGuides.length} new) to guide-data.json`);
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Generated: ${stats.generated}`);
    console.log(`   ⏭️  Skipped:   ${stats.skipped}`);
    console.log(`   ❌ Failed:    ${stats.failed}`);
    console.log(`   📸 Images:    ${stats.imagesCopied} copied`);
    console.log('\n🎉 AI Guide Generator complete!');
    if (!DRY_RUN) {
        console.log('👉 Now run node scripts/create-guides.js to generate HTML.\n');
    } else {
        console.log('👉 Dry run finished – no changes were made.\n');
    }
}

main().catch(err => {
    console.error('\n❌ Unhandled error:', err);
    process.exit(1);
});