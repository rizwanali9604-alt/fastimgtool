/**
 * Enhance guide content via DeepSeek API (optional).
 * Set DEEPSEEK_API_KEY in environment. Skips if unset.
 * Run: node scripts/enhance-guides.js [--limit=5]
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const KEY = process.env.DEEPSEEK_API_KEY;
const GUIDES_DIR = path.join(__dirname, '../guides');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : 3;

if (!KEY) {
    console.log('⚠️  DEEPSEEK_API_KEY not set — skipping AI enhancement.');
    console.log('   Add key to .env and re-run to enhance guide body content.');
    process.exit(0);
}

async function enhance(title, snippet, toolUrl) {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${KEY}`
        },
        body: JSON.stringify({
            model: 'deepseek-chat',
            max_tokens: 2500,
            messages: [
                {
                    role: 'system',
                    content:
                        'You write SEO guides for fastimgtool.com. Output HTML fragments only (h2,h3,p,ul,ol,li). 800-1200 words. Include FAQ with 5 questions. Mention the tool link naturally once.'
                },
                {
                    role: 'user',
                    content: `Rewrite and improve guide "${title}". Tool: ${toolUrl}. Current excerpt:\n${snippet.slice(0, 1500)}`
                }
            ]
        })
    });
    const data = await res.json();
    if (!data.choices || !data.choices[0]) throw new Error(JSON.stringify(data));
    return data.choices[0].message.content;
}

async function main() {
    const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.html') && f !== 'index.html').slice(0, LIMIT);
    for (const file of files) {
        const fp = path.join(GUIDES_DIR, file);
        let html = fs.readFileSync(fp, 'utf8');
        const titleM = html.match(/<h1[^>]*class="guide-title"[^>]*>([^<]+)/);
        const title = titleM ? titleM[1] : file;
        const contentM = html.match(/<article class="guide-content">([\s\S]*?)<\/article>/);
        if (!contentM) continue;
        console.log('Enhancing:', file);
        try {
            const enhanced = await enhance(title, contentM[1], '/tools/image-compressor/');
            html = html.replace(contentM[0], `<article class="guide-content">\n${enhanced}\n</article>`);
            fs.writeFileSync(fp, html, 'utf8');
            console.log('  ✅ done');
            await new Promise((r) => setTimeout(r, 1200));
        } catch (e) {
            console.error('  ❌', e.message);
        }
    }
}

main();
