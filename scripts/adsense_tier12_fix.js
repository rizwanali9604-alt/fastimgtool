/**
 * AdSense Tier 1 + Tier 2 fix:
 * - Rewrite 21 pillar guides into short accurate guides
 * - Expand unique SEO on all 24 tool pages
 * - Delete noindexed clone guides
 * - Fix blog/community dead links
 * - Regen guides/index.html + keep sitemap tool/guide lists consistent
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const seoBase = require('./tool-seo-content.js');

const PILLAR_GUIDES = {
  'how-to-blur-image-online.html': {
    slug: 'image-blur',
    title: 'How to Blur an Image Online',
    subtitle: 'Apply a full-image blur with a single slider — private, free, no signup.',
    h1: 'How to Blur an Image Online',
    breadcrumb: 'How to Blur an Image Online',
    meta: 'Blur images in your browser with FastImageTool. Adjust strength 1–25px, download PNG. No upload, no account.',
  },
  'how-to-sharpen-image-online.html': {
    slug: 'image-sharpen',
    title: 'How to Sharpen an Image Online',
    subtitle: 'Increase edge clarity on soft product photos before you list them.',
    h1: 'How to Sharpen an Image Online',
    breadcrumb: 'How to Sharpen an Image Online',
    meta: 'Sharpen soft product photos online. Free browser tool with a 0.5–3.0 slider. No upload to a server.',
  },
  'how-to-convert-image-to-grayscale.html': {
    slug: 'image-grayscale',
    title: 'How to Convert an Image to Grayscale',
    subtitle: 'Turn color photos into black and white in one click.',
    h1: 'How to Convert an Image to Grayscale',
    breadcrumb: 'Convert to Grayscale',
    meta: 'Convert images to grayscale online for free. Browser-based, private, no signup.',
  },
  'how-to-flip-image-online.html': {
    slug: 'flip-image',
    title: 'How to Flip an Image Online',
    subtitle: 'Mirror horizontally or vertically without installing software.',
    h1: 'How to Flip an Image Online',
    breadcrumb: 'How to Flip an Image Online',
    meta: 'Flip images horizontal or vertical online. Free, private FastImageTool — works in your browser.',
  },
  'how-to-rotate-image-online.html': {
    slug: 'rotate-image',
    title: 'How to Rotate an Image Online',
    subtitle: 'Fix phone orientation with 90°, 180°, or 270° rotation.',
    h1: 'How to Rotate an Image Online',
    breadcrumb: 'How to Rotate an Image Online',
    meta: 'Rotate images 90°, 180°, or 270° online. Free browser tool for sellers and creators.',
  },
  'how-to-crop-image-online.html': {
    slug: 'image-crop',
    title: 'How to Crop an Image Online',
    subtitle: 'Crop to exact pixel dimensions from the center of your photo.',
    h1: 'How to Crop an Image Online',
    breadcrumb: 'How to Crop an Image Online',
    meta: 'Crop images to exact width and height online. Free, private, no signup.',
  },
  'how-to-use-base64-to-image.html': {
    slug: 'base64-to-image',
    title: 'How to Convert Base64 to an Image',
    subtitle: 'Paste a Base64 string and download a PNG.',
    h1: 'How to Convert Base64 to an Image',
    breadcrumb: 'Base64 to Image',
    meta: 'Decode Base64 to a downloadable PNG image in your browser. Free and private.',
  },
  'how-to-use-bmp-to-jpg.html': {
    slug: 'bmp-to-jpg',
    title: 'How to Convert BMP to JPG',
    subtitle: 'Shrink large bitmap files into marketplace-friendly JPEGs.',
    h1: 'How to Convert BMP to JPG',
    breadcrumb: 'BMP to JPG',
    meta: 'Convert BMP to JPG online free. Browser-based converter for large bitmap files.',
  },
  'how-to-use-gif-to-png.html': {
    slug: 'gif-to-png',
    title: 'How to Convert GIF to PNG',
    subtitle: 'Export the first GIF frame as a PNG for editing or web use.',
    h1: 'How to Convert GIF to PNG',
    breadcrumb: 'GIF to PNG',
    meta: 'Convert GIF to PNG online. Exports the first frame. Free, private browser tool.',
  },
  'how-to-use-heic-to-jpg.html': {
    slug: 'heic-to-jpg',
    title: 'How to Convert HEIC to JPG',
    subtitle: 'Open iPhone photos on Windows and upload them to Meesho or Amazon.',
    h1: 'How to Convert HEIC to JPG',
    breadcrumb: 'HEIC to JPG',
    meta: 'Convert iPhone HEIC photos to JPG in your browser. Free for Amazon and Meesho sellers.',
  },
  'how-to-adjust-image-brightness-online.html': {
    slug: 'image-brightness',
    title: 'How to Adjust Image Brightness Online',
    subtitle: 'Fix dark or washed-out product photos with a brightness slider.',
    h1: 'How to Adjust Image Brightness Online',
    breadcrumb: 'Image Brightness',
    meta: 'Adjust photo brightness online (−100 to +100). Free browser tool — no upload.',
  },
  'how-to-adjust-image-contrast-online.html': {
    slug: 'image-contrast',
    title: 'How to Adjust Image Contrast Online',
    subtitle: 'Make flat catalog shots look clearer before you publish.',
    h1: 'How to Adjust Image Contrast Online',
    breadcrumb: 'Image Contrast',
    meta: 'Adjust image contrast online for free. Browser-based tool for product photos.',
  },
  'how-to-invert-image-colors-online.html': {
    slug: 'image-invert',
    title: 'How to Invert Image Colors Online',
    subtitle: 'Create a negative-color effect with a controllable blend slider.',
    h1: 'How to Invert Image Colors Online',
    breadcrumb: 'Invert Colors',
    meta: 'Invert image colors online. Free browser tool with 0–100% blend control.',
  },
  'how-to-adjust-image-saturation-online.html': {
    slug: 'image-saturation',
    title: 'How to Adjust Image Saturation Online',
    subtitle: 'Boost or mute colors for catalog and social images.',
    h1: 'How to Adjust Image Saturation Online',
    breadcrumb: 'Image Saturation',
    meta: 'Adjust saturation online (−100 to +100). Free, private FastImageTool.',
  },
  'how-to-apply-sepia-filter-online.html': {
    slug: 'image-sepia',
    title: 'How to Apply a Sepia Filter Online',
    subtitle: 'Add a warm vintage tone with one slider.',
    h1: 'How to Apply a Sepia Filter Online',
    breadcrumb: 'Sepia Filter',
    meta: 'Apply sepia tone online (0–100%). Free browser image tool — no signup.',
  },
  'how-to-convert-image-to-base64.html': {
    slug: 'image-to-base64',
    title: 'How to Convert an Image to Base64',
    subtitle: 'Encode images as data URIs for HTML, CSS, or APIs.',
    h1: 'How to Convert an Image to Base64',
    breadcrumb: 'Image to Base64',
    meta: 'Convert images to Base64 online. Copy the string instantly — private and free.',
  },
  'how-to-convert-image-to-webp.html': {
    slug: 'image-to-webp',
    title: 'How to Convert an Image to WebP',
    subtitle: 'Shrink JPG/PNG for faster Shopify and website loads.',
    h1: 'How to Convert an Image to WebP',
    breadcrumb: 'Image to WebP',
    meta: 'Convert JPG or PNG to WebP online. Free browser converter for faster stores.',
  },
  'how-to-convert-png-to-webp.html': {
    slug: 'png-to-webp',
    title: 'How to Convert PNG to WebP',
    subtitle: 'Replace heavy PNGs with compact WebP files.',
    h1: 'How to Convert PNG to WebP',
    breadcrumb: 'PNG to WebP',
    meta: 'Convert PNG to WebP online free. Browser-based, no server upload.',
  },
  'how-to-convert-webp-to-jpg.html': {
    slug: 'webp-to-jpg',
    title: 'How to Convert WebP to JPG',
    subtitle: 'Make WebP files work in email and older marketplace uploaders.',
    h1: 'How to Convert WebP to JPG',
    breadcrumb: 'WebP to JPG',
    meta: 'Convert WebP to JPG online. Free browser tool with quality control.',
  },
  'how-to-convert-png-to-jpg.html': {
    slug: 'png-to-jpg',
    title: 'How to Convert PNG to JPG',
    subtitle: 'Reduce file size for Meesho and Amazon uploads. Transparency becomes white.',
    h1: 'How to Convert PNG to JPG',
    breadcrumb: 'PNG to JPG',
    meta: 'Convert PNG to JPG online free. Ideal for product listings that reject PNG.',
  },
  'how-to-use-tiff-to-jpg.html': {
    slug: 'tiff-to-jpg',
    title: 'How to Convert TIFF to JPG',
    subtitle: 'Turn print scans into web-friendly JPEGs.',
    h1: 'How to Convert TIFF to JPG',
    breadcrumb: 'TIFF to JPG',
    meta: 'Convert TIFF to JPG online. Free browser converter for scans and print files.',
  },
};

/** Extended unique copy for each tool (About 100–150 words + FAQs 60+ / What-is 80+) */
function buildToolCopy(slug) {
  const base = seoBase[slug];
  if (!base) return null;
  const name = base.name;
  const steps = base.howTo;

  const extras = {
    'image-compressor': {
      about: `Meesho expects product images that look sharp at least 600×600px and stay comfortably under 2MB so uploads don’t fail on mobile networks. Amazon India usually wants the longest side at 1000px or more (2000px is better for zoom) with a clean white background on the main image. Fast Image Compressor handles both workflows in your browser: pick JPEG for marketplaces or WebP for websites, set a max longer-side size, and download instantly. Nothing is uploaded to our servers — useful when your catalog includes unreleased stock. Compared with Photoshop or phone gallery “compress,” you skip installs, subscriptions, and re-exporting through three apps when you need fifty listing photos before a sale.`,
      whatIs: `Fast Image Compressor is a free browser tool that reduces JPG, PNG, and WebP file size while you keep control of output format and maximum pixel size. Sellers and creators use it when marketplace uploaders reject oversized photos, when email attachments must stay under a few megabytes, or when a Shopify theme needs lighter assets for mobile page speed. Processing runs locally with a quality/format workflow instead of re-photographing products. There is no account, watermark, or server copy of your image — open the page, adjust settings, compress, and download.`,
      faqs: [
        ['How does compression work here?', 'You choose an output format (JPEG, WebP, or PNG), optionally cap the longer side in pixels, and compress. The heavy work runs in your browser via a Web Worker so the tab stays responsive. JPEG is the usual pick for Meesho and Amazon India. WebP is better for websites when browsers support it. Always keep a master original; compressed files are for upload and sharing, not archival masters.'],
        ['Is it free?', 'Yes. There is no signup, trial period, or paid unlock for basic compression. The tool is supported by site advertising and optional recommended-product links elsewhere on the site, not by charging you per image.'],
        ['Will quality look bad after compress?', 'That depends on settings. Start with JPEG and a generous max dimension (for example 2048px) for listings. Lower quality only if the file is still too large for the platform. Preview the result and compare against your original before bulk-processing a catalog.'],
      ],
    },
    'image-resizer': {
      about: `Marketplace cards crop aggressively. Meesho sellers commonly target 600×600 square images; Amazon India favors large, sharp files with the product filling most of the frame; Instagram and YouTube each want different pixels. Phone gallery crop tools rarely offer exact pixel presets for every channel. The Image Resizer lets you dial exact width and height (with optional aspect lock) or use seller/social presets, then download in the browser. No Photoshop install, no uploading product shots to a random converter site — useful when you prepare one master photo into Meesho, Amazon, and social sizes in the same session.`,
      whatIs: `Image Resizer is a free online tool that changes an image’s pixel width and height to exact values you choose. Catalog managers and content creators use it when platforms reject the wrong dimensions, when thumbnails look stretched, or when a square listing image must be cut from a wider studio shot. It works in the browser: upload, set size or pick a preset, download. Files stay on your device during processing whenever the browser supports local canvas processing.`,
      faqs: [
        ['What sizes should Meesho and Amazon sellers use?', 'Meesho listings commonly use at least 600×600px. Amazon India typically needs 1000px or more on the longest side for zoom; many sellers export around 2000×2000 for main images. Always confirm current rules in Seller Central or your Meesho seller panel because categories can differ.'],
        ['Is Image Resizer free?', 'Yes — no signup and no watermark on the downloaded file. Use it for as many product photos as you need while preparing catalogs.'],
        ['Do you store my images?', 'No. Processing is designed to run locally in your browser. We do not ask you to create an account to resize files, and we do not build a cloud album of your catalog.'],
      ],
    },
    'image-blur': {
      about: `Sellers sometimes need to obscure a face, house number, packaging barcode, or on-screen chat before posting a product video still or support screenshot. Phone apps bury blur behind subscriptions; desktop editors are slow for a one-off task. Image Blur applies a full-frame Gaussian-style blur controlled by a single slider (1–25px), previewed live, then saved as PNG — all in the browser. It does not include brush-based selective blur or object detection; for partial blur, crop first or use a dedicated editor. Use it when privacy matters more than keeping the background sharp.`,
      whatIs: `Image Blur is a free browser tool that softens an entire image by a chosen intensity. People use it to anonymize screenshots before sharing them with customers or teammates, to mute busy backgrounds for mockups, or to create a soft creative look. You upload a common image format, move the blur slider, watch the preview, and download. There is no account requirement and no claim that images leave your device for server processing.`,
      faqs: [
        ['Can I blur only a face or license plate?', 'Not with this tool’s current UI. The slider blurs the whole image. For selective privacy edits, crop the sensitive area separately, use a mobile app with a brush blur, or a desktop editor with masks — then return here if you need a uniform soft effect.'],
        ['Is Image Blur free?', 'Yes. No signup, no watermark. Strength is limited to the 1–25 range exposed on the page.'],
        ['What format do I get?', 'Downloads are PNG after processing so the blurred result preserves detail transitions cleanly. Convert to JPG afterward with our PNG to JPG tool if a marketplace rejects PNG.'],
      ],
    },
    'image-sharpen': {
      about: `Slight softness from phone handshake or aggressive WhatsApp compression makes fabric texture and label text hard to read on Meesho and Amazon thumbnails. Rather than reopening Lightroom, Image Sharpen adds a controlled edge enhancement with a 0.5–3.0 slider and live preview, then exports PNG from the browser. It cannot rebuild a completely out-of-focus shot; it accentuates detail that already exists. Useful for quick listing cleanup without installing software on a packing-desk PC.`,
      whatIs: `Image Sharpen is a free online tool that increases apparent clarity by boosting edge contrast. Sellers and creators apply it when photos look slightly soft after resize or chat-app compression. Upload, adjust the slider carefully (over-sharpening creates halos), preview at 100% on detail areas, then download. Processing stays in the browser.`,
      faqs: [
        ['Will sharpening fix a totally blurry photo?', 'No. If the camera missed focus and no detail was captured, sharpening only exaggerates mush. Reshoot when possible. This tool helps mild softness, not optical failure.'],
        ['Is it free?', 'Yes — free to use in the browser with no account.'],
        ['Any tips for product photos?', 'Sharpen after you finish resizing. Start mid-range on the slider, zoom into stitching or text, and stop when edges look crisp without white fringing.'],
      ],
    },
    'image-brightness': {
      about: `Indoor product shoots under tube lights often come out underexposed; flash can wash out packaging colors. Image Brightness exposes a −100 to +100 slider so you can correct exposure before listing without waiting for a studio retoucher. Everything runs in the browser — helpful for Indian sellers editing on the same laptop they use for Seller Central. Pair with contrast and compressor tools when the corrected file is still too heavy to upload.`,
      whatIs: `Image Brightness is a free browser-based adjustment tool. Move one slider to lighten or darken an image, preview live, and download. It is meant for quick exposure fixes on catalog and social images, not for professional color grading suites. No signup is required.`,
      faqs: [
        ['When should I raise brightness vs reshoot?', 'Raise brightness for slightly dark phone photos of clear products. If shadow detail is pure black or colors clip, reshoot with better lighting (ring light + white backdrop).'],
        ['Is the tool free?', 'Yes. Free, no watermark, no account.'],
        ['Are files uploaded?', 'Processing is designed to happen locally in your browser. We do not require you to upload photos to an account gallery.'],
      ],
    },
    'image-contrast': {
      about: `Flat noon lighting and dusty shop floors can leave product photos looking grey and dull. Increasing contrast separates the item from the background — important when Amazon and Meesho thumbnails are tiny on mobile. Image Contrast offers a −100 to +100 slider with live preview, processed privately in the browser. Combine with brightness for underexposed shots, then compress for upload.`,
      whatIs: `Image Contrast is a free online slider tool that strengthens or softens the difference between dark and light tones. Catalog managers use it so products read clearly in search grids. Upload, adjust, download — no desktop suite required.`,
      faqs: [
        ['Can high contrast hurt listing quality?', 'Yes. Too much contrast blacks out fabric detail and looks unnatural. Adjust gradually and check skin tones or package text at 100% zoom.'],
        ['Is it free?', 'Yes — no signup.'],
        ['What formats work?', 'Common formats such as JPG, PNG, and WebP are accepted through the upload control on the page.'],
      ],
    },
    'image-saturation': {
      about: `Marketplace photos sometimes look muddy after phone auto-processing, or oversaturated after beauty filters. Image Saturation lets you dial color intensity −100 to +100 in the browser so apparel and food colors look closer to what buyers receive — reducing returns from color mismatch. No Photoshop seat required for a packing-warehouse laptop.`,
      whatIs: `Image Saturation is a free browser tool to boost or mute colors. Creators and sellers use it to match brand color accuracy or to quiet neon casts from cheap LEDs. Adjust the slider, preview, download.`,
      faqs: [
        ['Should fashion sellers increase saturation?', 'Slightly if fabric looks dull, but stay honest. Oversaturated listings that differ from the delivered product create returns and poor ratings.'],
        ['Is it free?', 'Yes.'],
        ['Private?', 'Edits run in your browser; you do not need an account to download results.'],
      ],
    },
    'image-sepia': {
      about: `Sepia is a deliberate creative or branding choice — warm brown tones for lifestyle posts or story highlights — not something Amazon main images usually want (those prefer accurate color on white). Image Sepia applies a 0–100% vintage tone via one slider in the browser. Use it for social creativity; keep primary marketplace heroes accurate with other tools.`,
      whatIs: `Image Sepia is a free online filter that remaps colors toward a warm brown monochrome look. Strength is controllable. Processing is local in the browser with no signup.`,
      faqs: [
        ['Is sepia OK for Meesho main images?', 'Generally no for the primary product image. Keep listing heroes true-to-color; use sepia on secondary lifestyle or Instagram content if it matches your brand.'],
        ['Free?', 'Yes.'],
        ['Can I undo after download?', 'Keep your original file. Sepia permanently alters the downloaded pixels.'],
      ],
    },
    'image-invert': {
      about: `Designers and developers sometimes need a quick negative for mockups, accessibility contrast checks, or creative posts. Image Invert blends toward inverted RGB values with a 0–100% slider and downloads PNG from the browser — faster than opening a full editor for a one-shot effect.`,
      whatIs: `Invert Colors is a free browser tool that flips light and dark (and color channels) by a controllable amount. It is for creative and diagnostic uses, not for normal marketplace catalog photos.`,
      faqs: [
        ['Is this the same as dark mode?', 'Related idea, different purpose. System dark mode inverts UI rendering; this tool permanently alters image pixels you download.'],
        ['Free?', 'Yes.'],
        ['Formats?', 'Upload common image types shown in the drop zone; download as PNG after invert.'],
      ],
    },
    'image-grayscale': {
      about: `Black-and-white conversion is useful for documents, print drafts, artistic feeds, or reducing visual noise in instructional graphics. Image Grayscale converts in the browser without a subscription. Marketplace main images usually stay in color; use grayscale when the channel or layout calls for it.`,
      whatIs: `Grayscale is a free tool that removes color information and leaves luminance tones. Upload a color photo, convert, download. Local browser processing, no account.`,
      faqs: [
        ['Does grayscale shrink file size a lot?', 'Sometimes, especially after re-encoding as JPEG. For major size reductions, still use the Image Compressor after conversion.'],
        ['Free?', 'Yes.'],
        ['Can I restore color later?', 'Not from the grayscale file. Keep the color original.'],
      ],
    },
    'image-crop': {
      about: `Square Meesho cards, passport photos, and banner crops all need precise pixels. Image Crop takes width and height and crops from the center — simple on purpose, for sellers who already framed the subject roughly. For freestyle brush crop, use a phone editor; for exact listing ratios, this page is faster than installing desktop software.`,
      whatIs: `Image Crop is a free browser cropper for exact pixel dimensions from the center of an image. Upload, enter size, preview, download. No signup.`,
      faqs: [
        ['Does it support freehand crop handles?', 'The current UI uses numeric width/height from center. Plan composition accordingly or pre-crop on your phone then finalize size here.'],
        ['Free?', 'Yes.'],
        ['Best for sellers?', 'Yes when you need consistent square or custom sizes across a catalog batch.'],
      ],
    },
    'flip-image': {
      about: `Mirroring fixes reversed logos from phone selfie cameras or creates layout variants for ads. Flip Image offers horizontal or vertical flip with instant preview in the browser — no Canva project required for a one-click mirror.`,
      whatIs: `Flip Image is a free online mirror tool. Choose horizontal or vertical, preview, download. Private browser processing.`,
      faqs: [
        ['Will text look backward?', 'Horizontal flip reverses text. Avoid flipping photos that include readable packaging text unless that is intentional.'],
        ['Free?', 'Yes.'],
        ['Difference vs rotate?', 'Flip mirrors; rotate turns the canvas. Use rotate for orientation, flip for mirroring.'],
      ],
    },
    'rotate-image': {
      about: `Phones still save sideways photos when sensors disagree. Marketplaces reject or display tall products poorly when orientation is wrong. Rotate Image applies 90° / 180° / 270° turns in the browser so warehouse staff can fix folders of shots without Photoshop.`,
      whatIs: `Rotate Image is a free browser tool for quarter-turn and 180° rotation. Upload, pick an angle, download. No account.`,
      faqs: [
        ['Can I rotate by arbitrary degrees like 15°?', 'Not on this page. Use 90° steps here; for free angles use a fuller editor.'],
        ['Free?', 'Yes.'],
        ['Quality loss?', 'PNG/canvas export keeps fidelity for typical listing needs. Recompress with Image Compressor only if file size must drop further.'],
      ],
    },
    'jpg-to-png': {
      about: `Some design workflows and printers ask for PNG. JPG to PNG converts in the browser without uploading to a third-party converter. Note: converting JPG to PNG does not magically add transparency — the jpeg already discarded alpha. Use PNG when a workflow requires it; use JPG/WebP when you need smaller files for Meesho uploads.`,
      whatIs: `JPG to PNG is a free format converter that runs in your browser. Upload JPEG, download PNG. Private and free.`,
      faqs: [
        ['Will PNG be smaller than JPG?', 'Usually larger. Convert for format compatibility, not for compression. Compress or use WebP when size is the goal.'],
        ['Free?', 'Yes.'],
        ['Transparency?', 'Source JPG has no transparency to preserve. Start from PNG/WebP with alpha if you need see-through backgrounds.'],
      ],
    },
    'png-to-jpg': {
      about: `PNG product exports from Canva or remove-bg tools are often too large for Meesho. PNG to JPG reduces size; transparent pixels become white — perfect for white-background Amazon mains. Quality slider helps balance sharpness vs upload limits. Faster than re-exporting from a design suite on a slow PC.`,
      whatIs: `PNG to JPG is a free browser converter that turns PNG files into JPEG. Sellers use it before marketplace upload when PNG is rejected or too heavy.`,
      faqs: [
        ['What happens to transparency?', 'Transparent areas become white in the JPG. Put products on white first if you need a pure white main image.'],
        ['Free?', 'Yes.'],
        ['Quality setting?', 'Higher keeps more detail and a bigger file. Start high for Amazon zoom; lower if Meesho upload fails on size.'],
      ],
    },
    'webp-to-jpg': {
      about: `Browsers love WebP; many email clients and older seller apps still prefer JPG. WebP to JPG converts locally so you can pull a WebP from a CDN or Chrome save-as and still upload to marketplaces. Quality defaults stay high enough for catalog use.`,
      whatIs: `WebP to JPG is a free online converter for making WebP files widely compatible as JPEG. Browser-based, no signup.`,
      faqs: [
        ['Why not keep WebP?', 'Keep WebP for your website. Convert to JPG when the destination cannot accept WebP.'],
        ['Free?', 'Yes.'],
        ['Private?', 'Conversion is designed to run in your browser without an account upload gallery.'],
      ],
    },
    'image-to-webp': {
      about: `Shopify and modern sites load faster with WebP. Image to WebP converts JPG/PNG with a quality slider in the browser so store owners shrink assets without a CLI. Pair with compressor workflows when you also need exact pixel sizes for banners.`,
      whatIs: `Image to WebP is a free browser converter that outputs the WebP format for faster page loads. Upload JPG or PNG, set quality, download.`,
      faqs: [
        ['Do all marketplaces accept WebP?', 'Many Indian marketplaces still prefer JPG for listing images. Use WebP primarily for your own storefront or blog.'],
        ['Free?', 'Yes.'],
        ['Quality tip?', '70–85 is often a good web tradeoff; check visual edges on text overlays.'],
      ],
    },
    'png-to-webp': {
      about: `UI screenshots and graphic PNGs can dominate page weight. PNG to WebP creates smaller files for documentation sites and Shopify theme assets while you keep a PNG master locally.`,
      whatIs: `PNG to WebP is a free browser tool dedicated to PNG→WebP conversion with quality control.`,
      faqs: [
        ['Lossy or lossless?', 'Use the quality control on the page for typically lossy-leaning web exports. Keep original PNG for edits.'],
        ['Free?', 'Yes.'],
        ['Seller listings?', 'Prefer JPG for Meesho/Amazon unless the platform documents WebP support.'],
      ],
    },
    'bmp-to-jpg': {
      about: `Old scanners and Windows paint exports still produce huge BMP files that refuse to upload. BMP to JPG converts them in-browser into listing-ready JPEG with a quality slider — no installing IrfanView on a locked office PC.`,
      whatIs: `BMP to JPG is a free converter for bitmap files. Upload BMP, choose JPEG quality, download.`,
      faqs: [
        ['Why are BMPs so large?', 'BMP often stores uncompressed pixels. JPEG discards redundancy — expect dramatically smaller files.'],
        ['Free?', 'Yes.'],
        ['Color accuracy?', 'Use high quality for product color; then compress only if needed.'],
      ],
    },
    'gif-to-png': {
      about: `Sometimes you only need a still from a GIF — a logo frame or reaction image — for a listing infographic. GIF to PNG exports the first frame as PNG in the browser so you can sharpen, resize, or compress next.`,
      whatIs: `GIF to PNG converts the first frame of a GIF into a PNG file online, free and private.`,
      faqs: [
        ['Does it keep animation?', 'No. Animation is flattened to the first frame. Use video tools if you need motion.'],
        ['Free?', 'Yes.'],
        ['Next steps?', 'Resize or compress the PNG/JPG for the destination platform.'],
      ],
    },
    'heic-to-jpg': {
      about: `iPhone default HEIC breaks many Windows uploaders and Seller Central forms. HEIC to JPG converts in the browser so sellers can move from Camera Roll to Meesho/Amazon without a Mac. Set JPEG quality, download, then resize to marketplace pixels.`,
      whatIs: `HEIC to JPG is a free browser converter for Apple HEIC/HEIF photos into widely accepted JPEG files.`,
      faqs: [
        ['My browser fails to read HEIC — why?', 'Some browsers need adequate HEIC decoding support. Update the browser or try Chrome/Edge current versions. As a fallback, share from iPhone as Most Compatible before transfer.'],
        ['Free?', 'Yes.'],
        ['After convert?', 'Use Image Resizer for 600×600 or Amazon sizes, then Image Compressor if still large.'],
      ],
    },
    'tiff-to-jpg': {
      about: `Print shops and cameras export TIFF that websites and marketplaces reject. TIFF to JPG produces a web/listing JPEG in the browser so you do not need Photoshop just to open a scan for ecommerce.`,
      whatIs: `TIFF to JPG is a free online converter from TIFF scans/exports to JPEG for upload and sharing.`,
      faqs: [
        ['Multi-page TIFF?', 'Typical browser tools handle the primary raster page. Split multi-page documents in a desktop app first if needed.'],
        ['Free?', 'Yes.'],
        ['Quality?', 'Start high for text scans; lower only if file size blocks upload.'],
      ],
    },
    'image-to-base64': {
      about: `Developers embedding tiny icons in CSS/HTML or posting payloads to APIs need Base64 without sending assets to a random paste site. Image to Base64 encodes locally and shows the string to copy — aligned with FastImageTool’s no-upload promise for sensitive brand assets.`,
      whatIs: `Image to Base64 is a free browser encoder that turns an image file into a Base64 string or data URI for development workflows.`,
      faqs: [
        ['Should I Base64 large photos?', 'No. Large Base64 inflates HTML. Use for small icons; host large photos as normal files.'],
        ['Free?', 'Yes.'],
        ['Private?', 'Encoding runs in your browser; we do not need an account.'],
      ],
    },
    'base64-to-image': {
      about: `When an email, CMS, or API gives you a Base64 blob, Base64 to Image previews and downloads a PNG without pastebin round-trips. Handy for support teams debugging broken images from partners.`,
      whatIs: `Base64 to Image is a free decoder: paste a Base64 string (with or without data:image prefix), preview, download PNG.`,
      faqs: [
        ['Prefix required?', 'Either form works — with data:image/...;base64, or raw Base64 — follow the field hint on the page.'],
        ['Free?', 'Yes.'],
        ['Invalid string?', 'Check truncation and URL-safe alphabet variants; re-copy the full payload.'],
      ],
    },
  };

  const e = extras[slug] || {
    about: `${base.about} Indian sellers on Meesho and Amazon India use FastImageTool when they need a quick private edit without installing Photoshop or creating yet another converter account. ${name} runs in your browser: upload, adjust, download. Prefer this over phone gallery guesswork when you need repeatable settings across a catalog batch, and keep a master original of every product photo.`,
    whatIs: `${name} is a free online image tool on FastImageTool. ${base.about} It is built for sellers and creators who want fast results without uploading catalogs to unknown servers. Open the tool page, follow the on-screen controls, and download your file — no signup and no watermark.`,
    faqs: [
      [`How do I use ${name}?`, steps.map((s, i) => `${i + 1}. ${s}`).join(' ') + ' Keep a backup of the original file before batch edits.'],
      [`Is ${name} free?`, `Yes. FastImageTool does not require an account or payment to download results from ${name}.`],
      ['Are my images private?', 'Processing is designed to happen in your browser on your device. You do not create an account gallery to use the tool.'],
    ],
  };

  return { name, steps, ...e };
}

function seoSectionHtml(slug) {
  const c = buildToolCopy(slug);
  if (!c) return null;
  const how = c.steps.map((s) => `          <li><strong>Step:</strong> ${escapeHtml(s)}</li>`).join('\n');
  const faqs = [
    [`What is ${c.name}?`, c.whatIs],
    ...c.faqs,
  ]
    .map(
      ([q, a]) =>
        `        <h3>${escapeHtml(q)}</h3>\n        <p>${escapeHtml(a)}</p>`
    )
    .join('\n');

  return `        <section class="seo-content container" style="max-width:800px;margin:40px auto;padding:24px;background:var(--card,#111a30);border-radius:12px;line-height:1.8;border:1px solid var(--border,#334155);">
        <h2>About ${escapeHtml(c.name)}</h2>
        <p>${escapeHtml(c.about)}</p>
        <h2>How to Use ${escapeHtml(c.name)}</h2>
        <ol>
${how}
        </ol>
        <p><em>Privacy:</em> Processing is designed to run in your browser. Your images are not uploaded to a FastImageTool account.</p>
        <h2>Frequently Asked Questions</h2>
${faqs}
    </section>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function articleBody(meta) {
  const c = buildToolCopy(meta.slug);
  const toolUrl = `/tools/${meta.slug}/`;
  const steps = c.steps
    .map((s, i) => `<li><strong>Step ${i + 1}:</strong> ${escapeHtml(s)}</li>`)
    .join('\n');
  const faqs = [
    [`What does ${c.name} do?`, c.whatIs],
    ...c.faqs,
  ]
    .map(
      ([q, a]) =>
        `<div class="faq"><h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p></div>`
    )
    .join('\n');

  return `            <div class="inline-tool-cta"><div class="cta-icon">🖼️</div><div class="cta-text"><strong>Try it free: ${escapeHtml(c.name)}</strong><span>Browser-based — no signup</span></div><a href="${toolUrl}" class="cta-btn">Use Tool →</a></div>

            <p>${escapeHtml(c.about)}</p>

            <h2 id="steps">How to use ${escapeHtml(c.name)}</h2>
            <ol>
${steps}
            </ol>

            <h2 id="tips">Practical tips</h2>
            <ul>
              <li>Keep a full-resolution master of every product photo; export sized copies for each sales channel.</li>
              <li>For Meesho, aim for at least 600×600px and a manageable file size under 2MB.</li>
              <li>For Amazon India main images, prefer accurate color on a white background and 1000px+ on the longest side.</li>
              <li>This guide describes only the controls that exist on the tool page — no hidden brush tools or paid accounts.</li>
            </ul>

            <h2 id="faq">Frequently asked questions</h2>
            ${faqs}

            <h2 id="cta">Try it now</h2>
            <p><a href="${toolUrl}">Open ${escapeHtml(c.name)} →</a></p>
            <div class="inline-tool-cta"><div class="cta-icon">🖼️</div><div class="cta-text"><strong>Try it free: ${escapeHtml(c.name)}</strong><span>Use our browser-based tool — no signup</span></div><a href="${toolUrl}" class="cta-btn">Use Tool →</a></div>`;
}

function rewritePillarGuide(file) {
  const meta = PILLAR_GUIDES[file];
  const full = path.join(ROOT, 'guides', file);
  let html = fs.readFileSync(full, 'utf8');

  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${meta.meta.replace(/"/g, '&quot;')}">`
  );
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${meta.title} — FastImageTool</title>`
  );
  html = html.replace(
    /<h1 class="guide-title">[^<]*<\/h1>/,
    `<h1 class="guide-title">${meta.h1}</h1>`
  );
  html = html.replace(
    /<p class="guide-subtitle">[^<]*<\/p>/,
    `<p class="guide-subtitle">${meta.subtitle}</p>`
  );
  html = html.replace(/<span>📖 [^<]*<\/span>/, '<span>📖 4 min read</span>');
  html = html.replace(/Updated May 2026|Updated June 2026/g, 'Updated August 2026');

  // Fix sidebar tool link if present
  html = html.replace(
    /<a href="\/tools\/[^"]*" class="sidebar-tool-link">→ Open [^<]*<\/a>/,
    `<a href="/tools/${meta.slug}/" class="sidebar-tool-link">→ Open ${seoBase[meta.slug].name}</a>`
  );

  const body = articleBody(meta);
  html = html.replace(
    /<article class="guide-content">[\s\S]*?<\/article>/,
    `<article class="guide-content">\n${body}\n        </article>`
  );

  fs.writeFileSync(full, html);
  return file;
}

function rewriteToolSeo(slug) {
  const file = path.join(ROOT, 'tools', slug, 'index.html');
  if (!fs.existsSync(file)) return null;
  let html = fs.readFileSync(file, 'utf8');
  const section = seoSectionHtml(slug);
  if (!section) return null;

  if (/<section class="seo-content[\s\S]*?<\/section>/.test(html)) {
    html = html.replace(/<section class="seo-content[\s\S]*?<\/section>/, section.trim());
  } else {
    return null;
  }
  fs.writeFileSync(file, html);
  return slug;
}

function deleteNoindexGuides() {
  const dir = path.join(ROOT, 'guides');
  const deleted = [];
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html') || f === 'index.html') continue;
    const full = path.join(dir, f);
    const html = fs.readFileSync(full, 'utf8');
    if (/noindex/i.test(html)) {
      fs.unlinkSync(full);
      deleted.push(f);
    }
  }
  return deleted;
}

function stripGuideAffiliateBlocks() {
  const dir = path.join(ROOT, 'guides');
  let n = 0;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.html')) continue;
    const full = path.join(dir, f);
    let html = fs.readFileSync(full, 'utf8');
    const before = html;
    // Remove recommended-tools blocks that are mostly affiliate spam
    html = html.replace(/<div class="recommended-tools">[\s\S]*?<\/div>/g, '');
    // Remove leftover amazon image editing software search links in guides
    html = html.replace(
      /<li><a href="https:\/\/www\.amazon\.in\/s\?k=image\+editing\+software[^"]*"[^>]*>[\s\S]*?<\/li>/gi,
      ''
    );
    html = html.replace(/src="\/placeholder[^"]*"/g, 'src=""');
    html = html.replace(/<img[^>]*src=""[^>]*>/g, '');
    html = html.replace(/<img[^>]*src="\/placeholder[^"]*"[^>]*>/g, '');
    if (html !== before) {
      fs.writeFileSync(full, html);
      n++;
    }
  }
  return n;
}

function fixDeadLinks() {
  const replacements = [
    [
      'blog/how-to-resize-images-for-social-media.html',
      /<a href="#">image resizer and compressor<\/a>/g,
      '<a href="/tools/image-resizer/">image resizer</a> and <a href="/tools/image-compressor/">compressor</a>',
    ],
    [
      'blog/how-to-compress-images-for-email.html',
      /<a href="#">image resizer and compressor<\/a>/g,
      '<a href="/tools/image-resizer/">image resizer</a> and <a href="/tools/image-compressor/">compressor</a>',
    ],
    [
      'blog/how-to-create-a-favicon.html',
      /<a href="#">image resizer and compressor<\/a>/g,
      '<a href="/tools/image-resizer/">image resizer</a> and <a href="/tools/image-compressor/">compressor</a>',
    ],
    [
      'blog/webp-vs-jpg-vs-png.html',
      /<a href="#">image resizer and compressor<\/a>/g,
      '<a href="/tools/image-resizer/">image resizer</a> and <a href="/tools/image-compressor/">compressor</a>',
    ],
  ];
  for (const [rel, re, to] of replacements) {
    const full = path.join(ROOT, rel);
    let html = fs.readFileSync(full, 'utf8');
    html = html.replace(re, to);
    fs.writeFileSync(full, html);
  }
  const community = path.join(ROOT, 'community.html');
  let c = fs.readFileSync(community, 'utf8');
  c = c.replace(
    /<li><strong>📢 Follow us on social media:<\/strong> <a href="#">Twitter<\/a> \| <a href="#">Facebook<\/a> \(links to be added\)\.<\/li>/,
    '<li><strong>📢 Social updates:</strong> Follow new tool announcements on our <a href="/blog/">blog</a>.</li>'
  );
  fs.writeFileSync(community, c);
}

function regenGuidesIndex() {
  const guides = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'guides.json'), 'utf8'));
  // Drop entries whose files were deleted
  const kept = guides.filter((g) => {
    const file = path.join(ROOT, g.url.replace(/^\//, ''));
    return fs.existsSync(file);
  });
  fs.writeFileSync(path.join(ROOT, 'data', 'guides.json'), JSON.stringify(kept, null, 2) + '\n');

  const cards = kept
    .map(
      (g) => `
        <a href="${g.url}" class="tool-card-h">
            <div class="tool-icon-wrap">📖</div>
            <div class="tool-info">
                <div class="tool-name">${escapeHtml(g.title)}</div>
                <div class="tool-desc">Read guide</div>
            </div>
            <div class="tool-arrow">→</div>
        </a>`
    )
    .join('\n');

  const indexPath = path.join(ROOT, 'guides', 'index.html');
  let idx = fs.readFileSync(indexPath, 'utf8');
  idx = idx.replace(
    /<div class="tools-grid guides-list-grid">[\s\S]*?<\/div>\s*<\/main>/,
    `<div class="tools-grid guides-list-grid">${cards}\n        </div>\n    </main>`
  );
  fs.writeFileSync(indexPath, idx);
  return kept.length;
}

function main() {
  const report = { pillars: [], tools: [], deleted: [], affiliateStripped: 0, guidesKept: 0 };

  for (const file of Object.keys(PILLAR_GUIDES)) {
    report.pillars.push(rewritePillarGuide(file));
  }

  for (const slug of Object.keys(seoBase)) {
    const r = rewriteToolSeo(slug);
    if (r) report.tools.push(r);
  }

  report.deleted = deleteNoindexGuides();
  report.affiliateStripped = stripGuideAffiliateBlocks();
  fixDeadLinks();
  report.guidesKept = regenGuidesIndex();

  // Special-case: ensure compressor no longer has filler / duplicate H3
  const comp = path.join(ROOT, 'tools', 'image-compressor', 'index.html');
  let ch = fs.readFileSync(comp, 'utf8');
  if (/powerful online tool designed/.test(ch)) {
    console.warn('WARN: compressor still has generic filler — SEO section replace may have failed shape');
  }
  if (/<h2>Why Use[\s\S]*?<h3>Why Use/.test(ch)) {
    console.warn('WARN: compressor still has duplicate Why Use headings');
  }

  console.log(JSON.stringify({
    pillarsRewritten: report.pillars.length,
    toolsRewritten: report.tools.length,
    clonesDeleted: report.deleted.length,
    guidesWithAffiliateCleaned: report.affiliateStripped,
    guidesInJson: report.guidesKept,
  }, null, 2));
}

main();
