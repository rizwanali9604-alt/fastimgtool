const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname, 'assets', 'images', 'tools');
const outputDir = path.join(__dirname, 'assets', 'images', 'tools');

async function convertToWebP() {
  try {
    const files = await fs.readdir(sourceDir);
    const jpgFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg'));

    for (const file of jpgFiles) {
      const inputPath = path.join(sourceDir, file);
      const outputPath = path.join(outputDir, file.replace(/\.jpe?g$/i, '.webp'));

      await sharp(inputPath)
        .webp({ quality: 80 }) // adjust quality as needed
        .toFile(outputPath);

      console.log(`✅ Converted ${file} to WebP`);
    }
    console.log('🎉 All images converted!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

convertToWebP();