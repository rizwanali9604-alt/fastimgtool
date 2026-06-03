/**
 * FastImageTool (+ optional CalStacker) site examiner.
 * Uses DeepSeek V4-Pro for strategy reports.
 *
 * Run: npm run examine
 * Env: DEEPSEEK_API_KEY in .env
 */
const fs = require('fs');
const path = require('path');
const { DEEPSEEK_CONFIG, deepseekChat } = require('../lib/deepseek-config');

const SKIP_DIRS = new Set(['node_modules', '.git', 'assets', 'guides_backup', 'pinterest_data']);

function scanSiteFiles(rootDir) {
    const results = [];

    function scan(dir) {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            if (item.isDirectory()) {
                if (!SKIP_DIRS.has(item.name)) scan(fullPath);
                continue;
            }
            if (item.name !== 'index.html' && !item.name.endsWith('.html')) continue;
            if (dir.includes('node_modules')) continue;

            const content = fs.readFileSync(fullPath, 'utf8');
            const rel = fullPath.replace(rootDir, '').replace(/\\/g, '/');
            const plain = content.replace(/<[^>]+>/g, ' ');
            results.push({
                path: rel,
                size: content.length,
                hasAdSense:
                    content.includes('adsbygoogle') ||
                    content.includes('pagead2.googlesyndication'),
                hasAffiliate:
                    /amazon\.|fastimgtool78-21|zerodha|groww|angel/i.test(content),
                hasCanonical: /<link[^>]+rel=["']canonical["']/i.test(content),
                hasMeta: /meta\s+name=["']description["']/i.test(content),
                hasH1: /<h1[\s>]/i.test(content),
                hasSchema: /application\/ld\+json/i.test(content),
                wordCount: plain.split(/\s+/).filter(Boolean).length,
                title: (content.match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim() || 'No title',
                description:
                    (content.match(/name=["']description["']\s+content=["']([^"']*)["']/i) ||
                        content.match(/content=["']([^"']*)["']\s+name=["']description["']/i) ||
                        [])[1] || 'No description'
            });
        }
    }

    scan(rootDir);
    return results;
}

function summarizeSiteData(siteData) {
    const thin = siteData.filter((p) => p.wordCount < 500);
    const noAds = siteData.filter((p) => !p.hasAdSense).map((p) => p.path);
    const noMeta = siteData.filter((p) => !p.hasMeta).map((p) => p.path);
    const noCanon = siteData.filter((p) => !p.hasCanonical).map((p) => p.path);
    const noH1 = siteData.filter((p) => !p.hasH1).map((p) => p.path);
    const noSchema = siteData.filter((p) => !p.hasSchema).map((p) => p.path);
    const noAff = siteData.filter((p) => !p.hasAffiliate).map((p) => p.path);
    return {
        totalPages: siteData.length,
        averages: {
            wordCount: Math.round(
                siteData.reduce((s, p) => s + p.wordCount, 0) / Math.max(siteData.length, 1)
            )
        },
        missing: {
            adsense: noAds.slice(0, 40),
            metaDescription: noMeta.slice(0, 40),
            canonical: noCanon.slice(0, 40),
            h1: noH1.slice(0, 40),
            schema: noSchema.slice(0, 40),
            affiliate: noAff.slice(0, 40),
            thinContentUnder500: thin.slice(0, 30).map((p) => ({ path: p.path, words: p.wordCount }))
        },
        samplePages: siteData.slice(0, 25)
    };
}

async function analyzeWithDeepSeek(siteData, siteName) {
    const summary = summarizeSiteData(siteData);
    const prompt = `You are an expert SEO analyst examining ${siteName}.

SITE SUMMARY (JSON):
${JSON.stringify(summary, null, 2)}

Provide a comprehensive audit:

## 1. CRITICAL ISSUES (Must fix immediately)
- Exact file paths and specific fixes

## 2. MISSING ELEMENTS
- Pages missing AdSense, meta descriptions, canonical, thin content (<500 words), affiliate CTAs

## 3. SEO GAPS
## 4. DESIGN & UX ISSUES
## 5. REVENUE OPTIMIZATION
## 6. CONTENT STRATEGY (top 10 articles)
## 7. PRIORITY ACTION PLAN (Impact × Effort, top 10 ROI actions)
## 8. ESTIMATED IMPACT

Be specific with file paths. No generic advice only.`;

    return deepseekChat({
        model: DEEPSEEK_CONFIG.models.analysis,
        messages: [{ role: 'user', content: prompt }]
    });
}

async function runExaminer() {
    console.log('Starting site examination...\n');

    const reportDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

    const date = new Date().toISOString().split('T')[0];
    let fullReport = `# SITE AUDIT REPORT\nGenerated: ${date}\n\n`;

    const fastimgPath = path.join(__dirname, '..');
    console.log('Scanning FastImageTool:', fastimgPath);
    const fastimgData = scanSiteFiles(fastimgPath);
    console.log(`Found ${fastimgData.length} HTML pages`);

    const missingAds = fastimgData.filter((p) => !p.hasAdSense).map((p) => p.path);
    const missingMeta = fastimgData.filter((p) => !p.hasMeta).map((p) => p.path);
    console.log(`Missing AdSense: ${missingAds.length} pages`);
    console.log(`Missing meta description: ${missingMeta.length} pages`);

    try {
        const fastimgReport = await analyzeWithDeepSeek(fastimgData, 'FastImageTool.com');
        fullReport += `# FASTIMGTOOL.COM AUDIT\n\n${fastimgReport}\n\n---\n\n`;
    } catch (err) {
        fullReport += `# FASTIMGTOOL.COM AUDIT\n\nScan complete (${fastimgData.length} pages). AI analysis skipped: ${err.message}\n\n`;
        fullReport += `## Quick stats\n- Missing AdSense: ${missingAds.length}\n- Missing meta: ${missingMeta.length}\n`;
        if (missingAds.length) fullReport += `\n### Missing AdSense\n${missingAds.slice(0, 50).join('\n')}\n`;
        if (missingMeta.length) fullReport += `\n### Missing meta\n${missingMeta.slice(0, 50).join('\n')}\n`;
    }

    const calCandidates = [
        path.join(__dirname, '../../calstacker'),
        path.join(__dirname, '../../../calstacker'),
        'E:/Projects/calstacker'
    ];
    const calstackerPath = calCandidates.find((p) => fs.existsSync(p));
    if (calstackerPath) {
        console.log('\nScanning CalStacker:', calstackerPath);
        const calData = scanSiteFiles(calstackerPath);
        console.log(`Found ${calData.length} pages`);
        try {
            const calReport = await analyzeWithDeepSeek(calData, 'CalStacker.com');
            fullReport += `# CALSTACKER.COM AUDIT\n\n${calReport}\n\n`;
        } catch (err) {
            fullReport += `# CALSTACKER.COM AUDIT\n\nScan only (${calData.length} pages). AI skipped: ${err.message}\n`;
        }
    } else {
        console.log('\nCalStacker not found (optional sibling repo). Skipping.');
        fullReport += `# CALSTACKER.COM AUDIT\n\nCalStacker path not found. Clone beside fastimgtool or set path in script.\n`;
    }

    const reportPath = path.join(reportDir, `audit-${date}.md`);
    fs.writeFileSync(reportPath, fullReport);
    console.log(`\nReport saved: ${reportPath}`);
}

runExaminer().catch((err) => {
    console.error(err);
    process.exit(1);
});
