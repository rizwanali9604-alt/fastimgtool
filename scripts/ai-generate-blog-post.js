// scripts/ai-generate-blog-post.js
/**
 * AI Blog Post Generator – Production Grade v1.0
 * 
 * Features:
 * - Reads topics from data/blog-topics.json
 * - Generates full HTML blog posts with navbar/footer
 * - Updates blog-posts.json for the blog index
 * - Includes retry logic, rate limiting, and error handling
 */

require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const OpenAI = require('openai');

// ==================== Configuration ====================
const CONFIG = {
    apiKey: (() => {
        const key = process.env.DEEPSEEK_API_KEY;
        if (!key) {
            console.error('\n❌ DEEPSEEK_API_KEY not found in environment.\n');
            process.exit(1);
        }
        return key;
    })(),
    model: 'deepseek-chat',
    maxRetries: 3,
    retryDelay: 1000,
    rateLimitDelay: 3000,          // Longer delay for longer generations
    temperature: 0.8,
    maxTokensPerPost: 3000,
    topicsFile: path.join(__dirname, '..', 'data', 'blog-topics.json'),
    blogDir: path.join(__dirname, '..', 'blog'),
    blogPostsFile: path.join(__dirname, '..', 'data', 'blog-posts.json'),
};

const openai = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey: CONFIG.apiKey });

// ==================== Utilities ====================
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

/**
 * Extract navbar and footer from the main index.html.
 * @returns {Promise<{navbar: string, footer: string}>}
 */
async function getNavbarFooter() {
    const indexPath = path.join(__dirname, '..', 'index.html');
    const indexHtml = await fs.readFile(indexPath, 'utf8');
    const navbarMatch = indexHtml.match(/<nav class="navbar">[\s\S]*?<\/nav>/);
    const footerMatch = indexHtml.match(/<footer class="footer">[\s\S]*?<\/footer>/);
    if (!navbarMatch || !footerMatch) {
        throw new Error('Could not extract navbar or footer from index.html');
    }
    return { navbar: navbarMatch[0], footer: footerMatch[0] };
}

/**
 * Generate a full blog post using AI.
 * @param {object} topic - Topic object from blog-topics.json.
 * @returns {Promise<string>} HTML content for the post body.
 */
async function generatePost(topic) {
    const prompt = `Write a comprehensive, engaging blog post about "${topic.title}".
Target word count: ${topic.wordCount} words.
Focus keywords: ${topic.keywords.join(', ')}.
Structure: Use an introduction, several H2 subheadings, bullet points where appropriate, and a conclusion.
Include a natural call‑to‑action to try our free image tools (e.g., "Try our free image resizer and compressor").
Output in HTML format with proper <h2>, <p>, <ul>, <li> tags. Do not include <html> or <body>, just the content that would go inside the article.`;

    return withRetry(async () => {
        const response = await openai.chat.completions.create({
            model: CONFIG.model,
            messages: [
                { role: 'system', content: 'You are an expert blog writer for an image tools website. Write in a helpful, friendly tone.' },
                { role: 'user', content: prompt }
            ],
            temperature: CONFIG.temperature,
            max_tokens: CONFIG.maxTokensPerPost,
        });
        return response.choices[0].message.content.trim();
    }, topic.slug);
}

// ==================== Main ====================
async function generateAll() {
    console.log('\n🚀 Starting AI Blog Post Generation...\n');

    // 1. Read topics
    let topics;
    try {
        topics = JSON.parse(await fs.readFile(CONFIG.topicsFile, 'utf8'));
        console.log(`📦 Loaded ${topics.length} blog topics.`);
    } catch (err) {
        console.error('❌ Failed to read blog-topics.json:', err.message);
        process.exit(1);
    }

    // 2. Ensure blog directory exists
    await fs.mkdir(CONFIG.blogDir, { recursive: true });

    // 3. Get navbar and footer
    let navbar, footer;
    try {
        ({ navbar, footer } = await getNavbarFooter());
        console.log('✅ Extracted navbar and footer from index.html');
    } catch (err) {
        console.error('❌ Could not extract navbar/footer:', err.message);
        process.exit(1);
    }

    const blogPosts = [];

    // 4. Process each topic
    for (const topic of topics) {
        console.log(`\n⚙️  Generating post: ${topic.slug} (${topic.title})`);
        let content;
        try {
            content = await generatePost(topic);
        } catch (err) {
            console.error(`❌ Skipping ${topic.slug} due to generation failure.`);
            continue;
        }

        // Build full HTML
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${topic.title}</title>
    <meta name="description" content="${topic.description}">
    <link rel="canonical" href="https://fastimgtool.com/blog/${topic.slug}.html">
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="icon" href="/assets/favicon.png">
    <!-- AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8332278519903196" crossorigin="anonymous"></script>
</head>
<body>
${navbar}
    <main style="max-width:800px; margin:40px auto; padding:20px;">
        <article>
            ${content}
            <p style="text-align:center; margin-top:40px;">
                <a href="/tools/" style="background:#4da3ff; color:white; padding:10px 20px; border-radius:5px; text-decoration:none;">Try Our Free Tools</a>
            </p>
        </article>
    </main>
${footer}
    <script src="/assets/js/nav.js"></script>
</body>
</html>`;

        const outPath = path.join(CONFIG.blogDir, `${topic.slug}.html`);
        await fs.writeFile(outPath, html, 'utf8');
        console.log(`✅ Saved: blog/${topic.slug}.html`);

        blogPosts.push({
            title: topic.title,
            url: `/blog/${topic.slug}.html`,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            description: topic.description
        });

        await sleep(CONFIG.rateLimitDelay);
    }

    // 5. Update blog-posts.json
    try {
        await fs.writeFile(CONFIG.blogPostsFile, JSON.stringify(blogPosts, null, 2), 'utf8');
        console.log(`\n📝 Updated blog-posts.json with ${blogPosts.length} entries.`);
    } catch (err) {
        console.error('❌ Failed to write blog-posts.json:', err.message);
    }

    console.log('\n🎉 AI Blog Post Generation Complete!');
    console.log('👉 Now run node build.js to regenerate the blog index with the new posts.\n');
}

generateAll().catch(err => {
    console.error('\n❌ Unhandled error:', err);
    process.exit(1);
});