/**
 * DeepSeek V4 API config — loads key from .env only (never hardcode keys here).
 * Copy .env.example to .env and set DEEPSEEK_API_KEY.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const DEEPSEEK_CONFIG = {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1/chat/completions',
    models: {
        content: process.env.DEEPSEEK_MODEL_CONTENT || 'deepseek-v4-flash',
        analysis: process.env.DEEPSEEK_MODEL_ANALYSIS || 'deepseek-v4-pro'
    },
    maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '4000', 10)
};

function assertApiKey() {
    if (!DEEPSEEK_CONFIG.apiKey) {
        throw new Error(
            'DEEPSEEK_API_KEY not set. Add it to .env (see .env.example). Never commit .env to git.'
        );
    }
}

async function deepseekChat({ model, messages, maxTokens }) {
    assertApiKey();
    const res = await fetch(DEEPSEEK_CONFIG.baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DEEPSEEK_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: model || DEEPSEEK_CONFIG.models.content,
            max_tokens: maxTokens || DEEPSEEK_CONFIG.maxTokens,
            messages
        })
    });
    const data = await res.json();
    if (!res.ok || !data.choices || !data.choices[0]) {
        throw new Error(data.error?.message || JSON.stringify(data).slice(0, 500));
    }
    return data.choices[0].message.content;
}

module.exports = { DEEPSEEK_CONFIG, assertApiKey, deepseekChat };
