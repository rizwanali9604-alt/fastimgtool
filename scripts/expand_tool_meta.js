const fs = require('fs');
const path = require('path');

const TOOLS = path.join(__dirname, '..', 'tools');

const descriptions = {
  'image-compressor': 'Compress JPG, PNG, WebP in your browser for Meesho and Amazon. One file per visit. Images are not posted to our servers; ads and analytics still load.',
  'image-resizer': 'Resize to exact pixels for Meesho, Amazon, and Instagram in your browser. Marketplace presets cover-crop. Images are not posted to our servers; ads still load.',
  'image-sharpen': 'Free online image sharpen tool for Amazon and Meesho sellers. Make blurry product photos crisp and sharp in your browser. No signup required.',
  'image-grayscale': 'Free online grayscale converter for creators and sellers. Turn product photos black and white in your browser. No signup, instant download.',
  'image-invert': 'Free online color invert tool for designers and creators. Create negative image effects in your browser. Ads and analytics still load.',
  'image-to-base64': 'Free image to Base64 encoder for web developers and sellers. Encode JPG, PNG, WebP in your browser. No signup, private, instant results.',
  'image-to-webp': 'Free image to WebP converter for Shopify sellers and creators. Smaller files for faster product pages. No signup, browser-based, instant.',
  'webp-to-jpg': 'Free WebP to JPG converter for sellers and creators. Open WebP images on any device in your browser. No signup, instant download.',
  'image-contrast': 'Free online contrast adjuster for Amazon and Meesho sellers. Make product photos pop on marketplaces. No signup, live preview in browser.',
  'tiff-to-jpg': 'Free TIFF to JPG converter for sellers and print workflows. Compress large scans for web listings in your browser. No signup, instant results.',
  'png-to-webp': 'Free PNG to WebP converter for Shopify sellers. Reduce file size for faster product pages in your browser. No signup, instant download.',
  'bmp-to-jpg': 'Convert BMP to JPG in the browser for web upload and email. Smaller files. Images are not posted to our servers; ads still load.',
  'flip-image': 'Free online flip image tool for Meesho and Amazon product photos. Mirror horizontally or vertically in your browser. No signup, instant download.',
  'gif-to-png': 'Free GIF to PNG converter for creators and sellers. Extract the first frame as a PNG in your browser. No signup, no upload, instant.',
  'image-saturation': 'Free online saturation tool for Meesho sellers and social posts. Boost or mute product photo colors in your browser. No signup, live preview.',
  'image-sepia': 'Free online sepia effect tool for creators and social media. Add vintage warm tones to photos in your browser. No signup, instant download.',
  'image-crop': 'Free online crop tool. Center-crops to the pixel width and height you type. No drag box. No signup.',
  'rotate-image': 'Free online rotate image tool for sellers and creators. Rotate 90°, 180°, or 270° in your browser. No signup, private, instant download.',
  'base64-to-image': 'Free Base64 to image decoder for developers and sellers. Paste a string and download the image in your browser. No signup, instant results.',
  'heic-to-jpg': 'Free HEIC to JPG converter for iPhone photos. Convert for Amazon, Meesho listings, and email in your browser. No signup, instant download.',
  'image-brightness': 'Free online brightness adjuster for Amazon and Meesho sellers. Fix dark or washed-out product photos in your browser. No signup, live preview.',
  'jpg-to-png': 'Free JPG to PNG converter. Does not add transparency — JPEG has no alpha. Browser-based, no signup.',
  'png-to-jpg': 'Convert PNG to JPG in the browser. White background fill, smaller files for Meesho and email. Images are not posted to our servers; ads still load.',
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
