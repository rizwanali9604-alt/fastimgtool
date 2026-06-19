const fs = require('fs');
const path = require('path');

const TOOLS = path.join(__dirname, '..', 'tools');

const descriptions = {
  'image-compressor': 'Free online image compressor for Meesho and Amazon sellers. Compress JPG, PNG, WebP images instantly in your browser. No signup, no upload, 100% private.',
  'image-resizer': 'Free image resizer online for Meesho, Amazon, and Instagram sellers. Resize to exact pixels in your browser. No signup, instant download, 100% private.',
  'image-sharpen': 'Free online image sharpen tool for Amazon and Meesho sellers. Make blurry product photos crisp and sharp in your browser. No signup required.',
  'image-grayscale': 'Free online grayscale converter for creators and sellers. Turn product photos black and white in your browser. No signup, instant download.',
  'image-invert': 'Free online color invert tool for designers and creators. Create negative image effects in your browser. No signup, 100% private processing.',
  'image-to-base64': 'Free image to Base64 encoder for web developers and sellers. Encode JPG, PNG, WebP in your browser. No signup, private, instant results.',
  'image-to-webp': 'Free image to WebP converter for Shopify sellers and creators. Smaller files for faster product pages. No signup, browser-based, instant.',
  'webp-to-jpg': 'Free WebP to JPG converter for sellers and creators. Open WebP images on any device in your browser. No signup, instant download.',
  'image-contrast': 'Free online contrast adjuster for Amazon and Meesho sellers. Make product photos pop on marketplaces. No signup, live preview in browser.',
  'tiff-to-jpg': 'Free TIFF to JPG converter for sellers and print workflows. Compress large scans for web listings in your browser. No signup, instant results.',
  'png-to-webp': 'Free PNG to WebP converter for Shopify sellers. Reduce file size for faster product pages in your browser. No signup, instant download.',
  'bmp-to-jpg': 'Free BMP to JPG converter for sellers and creators. Smaller files for web upload and email in your browser. No signup, 100% private.',
  'flip-image': 'Free online flip image tool for Meesho and Amazon product photos. Mirror horizontally or vertically in your browser. No signup, instant download.',
  'gif-to-png': 'Free GIF to PNG converter for creators and sellers. Extract the first frame as a PNG in your browser. No signup, no upload, instant.',
  'image-saturation': 'Free online saturation tool for Meesho sellers and social posts. Boost or mute product photo colors in your browser. No signup, live preview.',
  'image-sepia': 'Free online sepia effect tool for creators and social media. Add vintage warm tones to photos in your browser. No signup, instant download.',
  'image-crop': 'Free online crop tool for Meesho, Amazon, and social media. Custom dimensions and aspect ratios in your browser. No signup, instant.',
  'rotate-image': 'Free online rotate image tool for sellers and creators. Rotate 90°, 180°, or 270° in your browser. No signup, private, instant download.',
  'base64-to-image': 'Free Base64 to image decoder for developers and sellers. Paste a string and download the image in your browser. No signup, instant results.',
  'heic-to-jpg': 'Free HEIC to JPG converter for iPhone photos. Convert for Amazon, Meesho listings, and email in your browser. No signup, instant download.',
  'image-brightness': 'Free online brightness adjuster for Amazon and Meesho sellers. Fix dark or washed-out product photos in your browser. No signup, live preview.',
  'jpg-to-png': 'Free JPG to PNG converter for designers and sellers. Preserve transparency in your browser with instant conversion. No signup, no server upload.',
  'png-to-jpg': 'Free PNG to JPG converter for Meesho and Amazon sellers. White background fill and smaller files in your browser. No signup, 100% private.',
  'image-blur': 'Free online blur image tool for Meesho and Amazon sellers. Gaussian blur with adjustable strength in your browser. No signup, instant results.',
};

let updated = 0;

for (const slug of fs.readdirSync(TOOLS)) {
  const file = path.join(TOOLS, slug, 'index.html');
  if (!fs.existsSync(file)) continue;

  const next = descriptions[slug];
  if (!next) {
    console.warn('Missing description for', slug);
    continue;
  }

  if (next.length < 120 || next.length > 155) {
    console.warn(`${slug}: length ${next.length} (target 120-155)`);
  }

  let html = fs.readFileSync(file, 'utf8');
  const match = html.match(/<meta name="description" content="([^"]*)">/);
  if (!match) continue;

  if (match[1] === next) {
    console.log(`${slug}: already OK (${next.length} chars)`);
    continue;
  }

  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${next}">`
  );
  fs.writeFileSync(file, html, 'utf8');
  updated++;
  console.log(`${slug}: ${match[1].length} → ${next.length} chars`);
}

console.log(`\nUpdated ${updated} tool pages`);
