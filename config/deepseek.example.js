/**
 * Optional local override (copy to deepseek.local.js — gitignored).
 * Prefer .env with DEEPSEEK_API_KEY instead.
 */
module.exports = {
    apiKey: 'YOUR_DEEPSEEK_API_KEY',
    baseUrl: 'https://api.deepseek.com/v1/chat/completions',
    models: {
        content: 'deepseek-v4-flash',
        analysis: 'deepseek-v4-pro'
    },
    maxTokens: 4000
};
