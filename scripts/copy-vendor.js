/**
 * Copy third-party browser libraries into assets/vendor for static hosting.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const VENDOR = path.join(ROOT, 'assets', 'vendor');

const copies = [
    {
        src: path.join(ROOT, 'node_modules', 'browser-image-compression', 'dist', 'browser-image-compression.js'),
        dest: path.join(VENDOR, 'browser-image-compression.js')
    },
    {
        src: path.join(ROOT, 'node_modules', 'heic2any', 'dist', 'heic2any.min.js'),
        dest: path.join(VENDOR, 'heic2any.min.js')
    }
];

if (!fs.existsSync(VENDOR)) {
    fs.mkdirSync(VENDOR, { recursive: true });
}

var ok = 0;
copies.forEach(function (item) {
    if (!fs.existsSync(item.src)) {
        console.warn('⚠️  Skip (not installed): ' + path.relative(ROOT, item.src));
        return;
    }
    fs.copyFileSync(item.src, item.dest);
    console.log('✅ Copied → assets/vendor/' + path.basename(item.dest));
    ok++;
});

if (ok === 0) {
    console.warn('Run npm install first to populate vendor assets.');
}
