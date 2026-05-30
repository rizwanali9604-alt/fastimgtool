/**
 * Ensures every tool page loads tool-core.js before tool.js (skips image-compressor).
 */
const fs = require('fs');
const path = require('path');

const TOOLS_DIR = path.join(__dirname, '..', 'tools');
const TAG = '<script src="/assets/js/tool-core.js"></script>';
const SKIP = new Set(['image-compressor']);

const dirs = fs.readdirSync(TOOLS_DIR, { withFileTypes: true }).filter(function (d) {
    return d.isDirectory();
});

dirs.forEach(function (d) {
    if (SKIP.has(d.name)) return;
    var htmlPath = path.join(TOOLS_DIR, d.name, 'index.html');
    if (!fs.existsSync(htmlPath)) return;

    var html = fs.readFileSync(htmlPath, 'utf8');
    if (html.includes('/assets/js/tool-core.js')) return;

    var toolScript = '<script src="/tools/' + d.name + '/tool.js"></script>';
    if (!html.includes(toolScript)) {
        console.warn('⚠️  No tool.js tag in tools/' + d.name + '/index.html');
        return;
    }

    html = html.replace(toolScript, TAG + '\n    ' + toolScript);
    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('✅ Injected tool-core.js → tools/' + d.name + '/index.html');
});
