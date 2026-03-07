// scripts/ai-generate-tool-content.js
/**
 * AI Tool Content Generator – Production Grade v1.0
 * 
 * Features:
 * - Validates API key on startup
 * - Implements exponential backoff retry logic
 * - Respects rate limits with configurable delays
 * - Handles partial failures gracefully
 * - Preserves existing content to avoid re‑generation
 * - Clear logging with emojis for easy monitoring
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
            console.error('\n❌ DEEPSEEK_API_KEY not found in environment. Please set it in .env file.\n');
            process.exit(1);
        }
        return key;
    })(),
   model: 'deepseek/deepseek-chat',         // Cost‑effective model
    maxRetries: 3,                   // Number of retry attempts
    retryDelay: 1000,                 // Initial retry delay (ms)
    rateLimitDelay: 2000,             // Delay between API calls (ms)
    temperature: 0.8,                  // Creativity vs predictability
    maxTokensPerSection: 600,          // Max tokens per generated section
    toolsFile: path.join(__dirname, '..', 'data', 'tools.json'),
    contentFile: path.join(__dirname, '..', 'data', 'tool-content.json'),
};

// ==================== Initialize OpenAI Client ====================
const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: CONFIG.apiKey,
});

// ==================== Utility Functions ====================
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry a function with exponential backoff.
 * @param {Function} fn - Async function to retry.
 * @param {string} context - Description for logging.
 * @returns {Promise<any>}
 */
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
 * Generate a single content section for a tool.
 * @param {object} tool - Tool object.
 * @param {string} sectionName - e.g., 'about', 'howTo', ...
 * @param {string} prompt - The prompt to send.
 * @returns {Promise<string>}
 */
async function generateSection(tool, sectionName, prompt) {
    const context = `${tool.slug}/${sectionName}`;
    return withRetry(async () => {
        const response = await openai.chat.completions.create({
            model: CONFIG.model,
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert content writer for an online image tools website. Write unique, helpful, and engaging content in HTML format. Use appropriate tags like <p>, <ul>, <li>, <h3>, etc. Do not include any meta‑commentary, just the raw HTML content.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: CONFIG.temperature,
            max_tokens: CONFIG.maxTokensPerSection,
        });
        return response.choices[0].message.content.trim();
    }, context);
}

// ==================== Main Generation Loop ====================
async function generateAll() {
    console.log('\n🚀 Starting AI Tool Content Generation...\n');

    // 1. Load tools
    let tools;
    try {
        tools = JSON.parse(await fs.readFile(CONFIG.toolsFile, 'utf8'));
        console.log(`📦 Loaded ${tools.length} tools from tools.json`);
    } catch (err) {
        console.error('❌ Failed to read tools.json:', err.message);
        process.exit(1);
    }

    // 2. Load existing content (if any)
    let existingContent = [];
    try {
        existingContent = JSON.parse(await fs.readFile(CONFIG.contentFile, 'utf8'));
        console.log(`📦 Loaded existing content for ${existingContent.length} tools`);
    } catch (err) {
        console.log('ℹ️ No existing content file found. Will create new.');
    }

    // 3. Map for quick lookup
    const contentMap = new Map(existingContent.map(c => [c.slug, c]));

    // 4. Define prompts for each section
    const sectionPrompts = {
        about: (tool) => `Write a unique "About" section for the online tool "${tool.title}". Describe what it does and its main benefit in 2‑3 sentences. Use HTML <p> tags.`,
        howTo: (tool) => `Write a unique "How to Use" section for "${tool.title}". Provide simple step‑by‑step instructions. Use an HTML ordered list <ol><li>...</li></ol>.`,
        whyUse: (tool) => `Write a unique "Why Use" section for "${tool.title}". List 3‑4 benefits in bullet points. Use HTML <ul><li>...</li></ul>.`,
        useCases: (tool) => `Write a unique "Common Use Cases" section for "${tool.title}". Provide 3‑4 specific examples. Use HTML <ul><li>...</li></ul>.`,
        faq: (tool) => `Write 3 frequently asked questions with answers for the tool "${tool.title}". Format each as <h3>Question?</h3><p>Answer.</p>.`
    };

    // 5. Iterate over tools
    for (const tool of tools) {
        console.log(`\n⚙️  Processing: ${tool.slug} (${tool.title})`);
        let toolContent = contentMap.get(tool.slug) || { slug: tool.slug };
        let updated = false;

        for (const [section, promptFn] of Object.entries(sectionPrompts)) {
            if (!toolContent[section]) {
                console.log(`   Generating ${section}...`);
                try {
                    const content = await generateSection(tool, section, promptFn(tool));
                    toolContent[section] = content;
                    updated = true;
                } catch (err) {
                    console.error(`   ❌ Failed to generate ${section} for ${tool.slug}`);
                    // Leave it empty; will retry on next run
                }
                // Respect rate limits
                await sleep(CONFIG.rateLimitDelay);
            } else {
                console.log(`   ✅ ${section} already exists, skipping.`);
            }
        }

        if (updated) {
            contentMap.set(tool.slug, toolContent);
        }
    }

    // 6. Save updated content
    const newContent = Array.from(contentMap.values());
    try {
        await fs.writeFile(CONFIG.contentFile, JSON.stringify(newContent, null, 2), 'utf8');
        console.log(`\n📝 Saved content for ${newContent.length} tools to ${path.basename(CONFIG.contentFile)}`);
    } catch (err) {
        console.error('❌ Failed to write content file:', err.message);
        process.exit(1);
    }

    console.log('\n🎉 AI Tool Content Generation Complete!\n');
}

// ==================== Execute ====================
generateAll().catch(err => {
    console.error('\n❌ Unhandled error:', err);
    process.exit(1);
});