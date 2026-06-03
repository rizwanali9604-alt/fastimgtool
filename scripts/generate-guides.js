/**
 * DeepSeek V4-Flash guide generator — adds entries to guide-data-extra.json,
 * then rebuilds HTML via create-guides.js (existing flat URL: /guides/{slug}.html).
 *
 * Run: npm run generate-guides
 *      npm run generate-guides -- --tool=image-compressor --limit=1
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { DEEPSEEK_CONFIG, deepseekChat } = require('../lib/deepseek-config');

const ROOT = path.join(__dirname, '..');
const TOOLS_FILE = path.join(ROOT, 'data', 'tools.json');
const EXTRA_FILE = path.join(ROOT, 'data', 'guide-data-extra.json');
const GUIDES_DIR = path.join(ROOT, 'guides');

const GUIDE_TYPES = [
    {
        type: 'how-to',
        title: (t) => `How to Use ${t.title} — Complete Guide`,
        focus: 'step-by-step tutorial'
    },
    {
        type: 'best-practices',
        title: (t) => `${t.title} — Best Practices for Sellers`,
        focus: 'professional tips and mistakes to avoid'
    },
    {
        type: 'comparison',
        title: (t) => `Free vs Paid ${t.title} Tools`,
        focus: 'comparison with alternatives'
    },
    {
        type: 'use-cases',
        title: (t) => `10 Best Use Cases for ${t.title} in 2026`,
        focus: 'real world applications for Amazon, Meesho, Shopify'
    },
    {
        type: 'seo-guide',
        title: (t) => `${t.title} for SEO — Optimize Images for Google`,
        focus: 'image SEO, Core Web Vitals, alt tags'
    }
];

const NICHE = {
    compression: 'ecommerce sellers and bloggers',
    resize: 'social media managers and marketplace sellers',
    conversion: 'designers and web developers',
    effects: 'photographers and content creators',
    editing: 'social media managers and sellers',
    test: 'developers'
};

function parseArgs() {
    const toolArg = process.argv.find((a) => a.startsWith('--tool='));
    const limitArg = process.argv.find((a) => a.startsWith('--limit='));
    return {
        toolSlug: toolArg ? toolArg.split('=')[1] : null,
        limit: limitArg ? parseInt(limitArg.split('=')[1], 10) : null,
        dryRun: process.argv.includes('--dry-run')
    };
}

function slugFor(toolSlug, type) {
    return `${toolSlug}-${type}`;
}

function existingSlugs(extra, guidesDir) {
    const fromJson = new Set(extra.map((g) => g.slug));
    if (!fs.existsSync(guidesDir)) return fromJson;
    for (const f of fs.readdirSync(guidesDir)) {
        if (f.endsWith('.html') && f !== 'index.html') {
            fromJson.add(f.replace(/\.html$/, ''));
        }
    }
    return fromJson;
}

async function generateContent(tool, guideType) {
    const title = guideType.title(tool);
    const niche = NICHE[tool.category] || 'creators and sellers';
    const toolUrl = `https://fastimgtool.com/tools/${tool.slug}/`;

    const prompt = `Write SEO guide content for FastImageTool.com.

TITLE: ${title}
TOOL: ${tool.title}
URL: ${toolUrl}
AUDIENCE: ${niche}
FOCUS: ${guideType.focus}

Requirements:
- 900-1200 words in HTML fragments only (h2, h3, p, ul, ol, li, strong, em)
- Mention Meesho, Amazon, Shopify where relevant
- 5 FAQ items at end as h3 questions + p answers
- CTA to tool after 3rd paragraph and at end
- Accurate, practical advice

Output ONLY the inner HTML for <article class="guide-content"> (no wrapper).`;

    return deepseekChat({
        model: DEEPSEEK_CONFIG.models.content,
        messages: [{ role: 'user', content: prompt }]
    });
}

async function main() {
    const { toolSlug, limit, dryRun } = parseArgs();
    const tools = JSON.parse(fs.readFileSync(TOOLS_FILE, 'utf8')).filter(
        (t) => t.slug !== 'test-tool'
    );
    const extra = fs.existsSync(EXTRA_FILE)
        ? JSON.parse(fs.readFileSync(EXTRA_FILE, 'utf8'))
        : [];
    const have = existingSlugs(extra, GUIDES_DIR);

    let queue = [];
    for (const tool of tools) {
        if (toolSlug && tool.slug !== toolSlug) continue;
        for (const gt of GUIDE_TYPES) {
            const slug = slugFor(tool.slug, gt.type);
            if (have.has(slug)) continue;
            queue.push({ tool, gt, slug });
        }
    }

    if (limit) queue = queue.slice(0, limit);
    console.log(`Guides to generate: ${queue.length}${dryRun ? ' (dry-run)' : ''}`);
    if (!queue.length) {
        console.log('All guide types exist. Use --tool=slug to target one tool.');
        return;
    }

    let ok = 0;
    let fail = 0;

    for (const job of queue) {
        const { tool, gt, slug } = job;
        const title = gt.title(tool);
        process.stdout.write(`  ${slug}... `);

        if (dryRun) {
            console.log('skip (dry-run)');
            continue;
        }

        try {
            const content = await generateContent(tool, gt);
            const description = `${title}. Free ${tool.title} for ${NICHE[tool.category] || 'creators'}.`;
            extra.push({
                tool_slug: tool.slug,
                tool_name: tool.title,
                slug,
                title,
                description: description.slice(0, 155),
                h1: title.replace(/ —.*/, ''),
                content
            });
            ok++;
            console.log('ok');
            await new Promise((r) => setTimeout(r, 1200));
        } catch (err) {
            fail++;
            console.log(`fail: ${err.message}`);
        }
    }

    if (!dryRun && ok) {
        fs.writeFileSync(EXTRA_FILE, JSON.stringify(extra, null, 2));
        console.log(`\nWrote ${ok} entries to guide-data-extra.json`);
        console.log('Rebuilding guide HTML...');
        execSync('node scripts/create-guides.js', { cwd: ROOT, stdio: 'inherit' });
    }

    console.log(`\nDone. Generated: ${ok}, Failed: ${fail}`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
