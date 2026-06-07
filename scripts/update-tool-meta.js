/** Update tool meta descriptions for SEO */
const fs = require('fs');
const path = require('path');

const META = {
    'image-compressor': 'Free image compressor online. Reduce JPG PNG WebP file size for Meesho, Amazon, Shopify. No signup, browser-based.',
    'image-resizer': 'Free image resizer online. Resize to Meesho 600×600, Amazon 1000×1000, Instagram 1080×1080. No signup, instant download.',
    'jpg-to-png': 'Convert JPG to PNG online free. Preserves transparency, instant conversion, browser-based. No upload to server.',
    'png-to-jpg': 'Convert PNG to JPG online free. White background fill, smaller files for web and email. Private browser tool.',
    'webp-to-jpg': 'Convert WebP to JPG online free. Open WebP images on any device. Instant browser conversion.',
    'image-blur': 'Blur images online free. Gaussian blur with adjustable strength. Works with JPG, PNG, WebP. Instant results.',
    'image-sharpen': 'Sharpen blurry photos online free. Enhance product images for Amazon and Meesho listings.',
    'image-grayscale': 'Convert images to grayscale online free. Black and white effect in your browser.',
    'flip-image': 'Flip images online free. Horizontal or vertical mirror. No signup required.',
    'image-crop': 'Crop images online free. Custom dimensions and aspect ratios for social media and sellers.',
    'rotate-image': 'Rotate images online free. 90°, 180°, 270° rotation. Browser-based, private.',
    'image-to-webp': 'Convert images to WebP online free. Smaller files for faster Shopify and website loading.',
    'heic-to-jpg': 'Convert HEIC to JPG online free. iPhone photos to JPG for Amazon, Meesho, and email.',
    'image-to-base64': 'Image to Base64 encoder online free. For web developers. Private, in-browser.',
    'base64-to-image': 'Base64 to image decoder online free. Paste a string, download the image instantly.',
    'png-to-webp': 'Convert PNG to WebP online free. Reduce file size for faster product pages.',
    'gif-to-png': 'Convert GIF to PNG online free. Extract first frame as PNG image.',
    'bmp-to-jpg': 'Convert BMP to JPG online free. Smaller files for web upload and email.',
    'tiff-to-jpg': 'Convert TIFF to JPG online free. Compress large scans for web and listings.',
    'image-brightness': 'Adjust image brightness online free. Live preview sliders. Browser-based.',
    'image-contrast': 'Adjust image contrast online free. Make product photos pop on marketplaces.',
    'image-saturation': 'Adjust image saturation online free. Boost or mute colors instantly.',
    'image-invert': 'Invert image colors online free. Create negative effect in your browser.',
    'image-sepia': 'Apply sepia effect online free. Vintage warm tone for photos and social posts.'
};

const file = path.join(__dirname, '../data/tools.json');
const tools = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const t of tools) {
    if (META[t.slug]) t.description = META[t.slug];
}
fs.writeFileSync(file, JSON.stringify(tools, null, 2) + '\n');
console.log('Updated', Object.keys(META).length, 'tool descriptions');
