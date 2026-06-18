/** Accurate How-to / About copy per tool slug for AdSense review. */
module.exports = {
  'image-sharpen': {
    name: 'Image Sharpen',
    howTo: [
      'Upload your image by clicking the drop zone or dragging a JPG, PNG, WebP, GIF, or BMP file.',
      'Use the Sharpen slider (0.5–3.0) to increase edge clarity. The preview updates as you adjust.',
      'Click Download to save the sharpened PNG. Processing runs entirely in your browser.',
    ],
    about: 'Sharpen soft product photos and fix mild blur from camera shake. Ideal for Amazon and Meesho listings where detail matters.',
  },
  'image-blur': {
    name: 'Image Blur',
    howTo: [
      'Upload an image using the drop zone.',
      'Adjust the Blur slider (1–25) to control how strong the blur effect is.',
      'Preview updates live. Click Download to save the blurred image as PNG.',
    ],
    about: 'Blur faces, backgrounds, or sensitive areas for privacy before sharing online.',
  },
  'image-brightness': {
    name: 'Image Brightness',
    howTo: [
      'Upload your photo to the drop zone.',
      'Move the Brightness slider (−100 to +100) until exposure looks right.',
      'Download the adjusted image when satisfied.',
    ],
    about: 'Fix dark product photos or washed-out images without desktop software.',
  },
  'image-contrast': {
    name: 'Image Contrast',
    howTo: [
      'Upload your image.',
      'Adjust the Contrast slider (−100 to +100). Preview updates in real time.',
      'Click Download to export the result.',
    ],
    about: 'Make flat product shots pop by increasing contrast, or soften harsh lighting.',
  },
  'image-saturation': {
    name: 'Image Saturation',
    howTo: [
      'Upload your image.',
      'Use the Saturation slider (−100 to +100) to boost or mute colors.',
      'Download when the preview looks correct.',
    ],
    about: 'Control color intensity for catalog photos and social posts.',
  },
  'image-sepia': {
    name: 'Image Sepia',
    howTo: [
      'Upload your image.',
      'Adjust the Sepia slider (0–100%) for vintage tone strength.',
      'Download the sepia-toned image.',
    ],
    about: 'Apply a warm vintage sepia effect in one step.',
  },
  'image-invert': {
    name: 'Invert Colors',
    howTo: [
      'Upload your image.',
      'Use the Invert slider (0–100%) to blend between original and inverted colors.',
      'Download the result as PNG.',
    ],
    about: 'Create negative-image effects for design mockups or accessibility tests.',
  },
  'image-grayscale': {
    name: 'Grayscale',
    howTo: [
      'Upload a color photo.',
      'The tool converts it to grayscale automatically in your browser.',
      'Click Download to save the black-and-white version.',
    ],
    about: 'Convert photos to black and white for catalogs, documents, or artistic use.',
  },
  'image-resizer': {
    name: 'Image Resizer',
    howTo: [
      'Upload your image, or click a preset (Meesho 600×600, Amazon 1000×1000, Instagram 1080×1080, etc.).',
      'Enter custom width and height in pixels. Optionally lock aspect ratio.',
      'Click Download to save the resized image.',
    ],
    about: 'Resize to exact marketplace and social media dimensions. No uploads to a server.',
  },
  'image-crop': {
    name: 'Image Crop',
    howTo: [
      'Upload your image.',
      'Enter crop width and height in pixels (crops from the center).',
      'Preview the crop, then click Download.',
    ],
    about: 'Crop to square, passport, or custom pixel dimensions for listings and web.',
  },
  'flip-image': {
    name: 'Flip Image',
    howTo: [
      'Upload your image.',
      'Choose Flip horizontal or Flip vertical.',
      'Preview updates instantly. Click Download to save.',
    ],
    about: 'Mirror images for design layouts or fix reversed camera shots.',
  },
  'rotate-image': {
    name: 'Rotate Image',
    howTo: [
      'Upload your image.',
      'Select rotation: 90° clockwise, 180°, or 90° counter-clockwise.',
      'Click Download to save the rotated image.',
    ],
    about: 'Fix wrong orientation from phones and scanners without re-shooting.',
  },
  'jpg-to-png': {
    name: 'JPG to PNG',
    howTo: [
      'Upload a JPEG file.',
      'The tool converts it to PNG in your browser.',
      'Click Download to save the PNG file.',
    ],
    about: 'Convert JPG to PNG for workflows that need lossless format (note: transparency is not added automatically).',
  },
  'png-to-jpg': {
    name: 'PNG to JPG',
    howTo: [
      'Upload a PNG file.',
      'Adjust JPEG quality (10–100%) if the slider is shown.',
      'Click Download to save a smaller JPG.',
    ],
    about: 'Shrink PNG product shots for faster uploads. Transparent areas become white.',
  },
  'webp-to-jpg': {
    name: 'WebP to JPG',
    howTo: [
      'Upload a WebP image.',
      'Set JPEG quality (default ~92%).',
      'Download the JPG for email, marketplaces, or older apps.',
    ],
    about: 'Convert WebP to universally compatible JPEG.',
  },
  'image-to-webp': {
    name: 'Image to WebP',
    howTo: [
      'Upload JPG or PNG.',
      'Set WebP quality (10–100%).',
      'Download the smaller WebP file for your website or Shopify store.',
    ],
    about: 'Modern WebP format for faster page loads.',
  },
  'png-to-webp': {
    name: 'PNG to WebP',
    howTo: [
      'Upload a PNG file.',
      'Choose WebP quality, then download.',
    ],
    about: 'Convert PNG graphics to compact WebP for web use.',
  },
  'bmp-to-jpg': {
    name: 'BMP to JPG',
    howTo: [
      'Upload a BMP bitmap file.',
      'Set JPEG quality, then download.',
    ],
    about: 'Convert large BMP files to compact JPG.',
  },
  'gif-to-png': {
    name: 'GIF to PNG',
    howTo: [
      'Upload a GIF (first frame is used).',
      'Download the PNG output.',
    ],
    about: 'Convert GIF frames to PNG for editing or web use.',
  },
  'heic-to-jpg': {
    name: 'HEIC to JPG',
    howTo: [
      'Upload an iPhone HEIC photo.',
      'Set JPEG quality (50–100%).',
      'Download JPG when conversion completes in your browser.',
    ],
    about: 'Open iPhone photos on Windows and upload to marketplaces that require JPG.',
  },
  'tiff-to-jpg': {
    name: 'TIFF to JPG',
    howTo: [
      'Upload a TIFF file.',
      'Set JPEG quality, then download.',
    ],
    about: 'Convert print-quality TIFF scans to web-friendly JPEG.',
  },
  'image-to-base64': {
    name: 'Image to Base64',
    howTo: [
      'Upload an image.',
      'Copy the Base64 string generated in the output area.',
      'Paste into HTML, CSS, or your development workflow.',
    ],
    about: 'Encode images as Base64 data URIs without server uploads.',
  },
  'base64-to-image': {
    name: 'Base64 to Image',
    howTo: [
      'Paste a Base64 string (with or without data:image prefix).',
      'Preview the decoded image.',
      'Click Download to save as PNG.',
    ],
    about: 'Decode Base64 image strings back to downloadable files.',
  },
};
