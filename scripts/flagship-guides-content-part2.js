/** Part 2: how-to compress, resize, jpg-to-png, resize-image-online */
module.exports = [
  {
    slug: 'how-to-compress-image-online.html',
    title: 'How to Compress an Image Online Without Losing Quality (2026) — FastImageTool',
    headline: 'How to Compress an Image Online Without Losing Quality',
    description:
      'Compress JPG, PNG, and WebP images online for free. Reduce file size for websites, email, and marketplaces — private browser tool, no signup.',
    breadcrumb: 'Compress Images Online',
    h1: 'How to Compress an Image Online',
    subtitle: 'Shrink file size for web, email, and seller listings while keeping photos sharp.',
    readMin: 8,
    metaTag: '🗜️ Image Compressor guide',
    toolSlug: 'image-compressor',
    ctaHref: '/tools/image-compressor/',
    ctaLabel: 'Compress Free',
    footerCtaTitle: 'Ready to compress?',
    footerCtaSub: 'Free Image Compressor — private, in-browser',
    sidebar: [
      ['/tools/image-compressor/', 'Image Compressor'],
      ['/tools/image-resizer/', 'Image Resizer'],
      ['/tools/png-to-jpg/', 'PNG to JPG'],
    ],
    related: [
      ['/guides/compress-image-for-email.html', 'Compress Image for Email'],
      ['/guides/compress-image-for-whatsapp.html', 'Compress for WhatsApp'],
      ['/guides/meesho-product-image-size-600x600-under-50kb.html', 'Meesho Image Size'],
    ],
    faqs: [
      [
        'How do I compress an image without losing quality?',
        'Resize to the display size you actually need, then compress JPEG at 75–85% quality. Avoid compressing the same file repeatedly — keep an uncompressed master.',
      ],
      [
        'Is online image compression safe?',
        'With FastImageTool, images are processed in your browser and are not uploaded to a server. That keeps product photos and personal images private.',
      ],
      [
        'What is a good file size for a website image?',
        'Hero images: 100–300 KB. Blog inline photos: 50–150 KB. Thumbnails: under 50 KB. Exact targets depend on dimensions and content.',
      ],
      [
        'Should I compress PNG or convert to JPG?',
        'Photographs should usually be JPG. PNG is for graphics, screenshots with text, or transparency. Converting photo PNGs to JPG often saves more than compressing PNG alone.',
      ],
      [
        'Can I compress WebP files?',
        'Yes. Upload WebP to the compressor or convert to JPG if you need wider compatibility.',
      ],
    ],
    body: `
            <div class="inline-tool-cta"><div class="cta-icon">🗜️</div><div class="cta-text"><strong>Try it free: Image Compressor</strong><span>Reduce file size in your browser — no signup</span></div><a href="/tools/image-compressor/" class="cta-btn">Use Tool →</a></div>
            <p>Large images slow websites, bounce email attachments, and fail on seller uploads. Compression reduces file size by removing data your eye cannot see at screen resolution — done right, the photo looks identical but loads in a fraction of the time. This guide covers when to compress, what settings to use, and how to do it free online without uploading files to a stranger's server.</p>

            <h2 id="why">Why compress images?</h2>
            <ul>
                <li><strong>Faster websites</strong> — Google uses page speed as a ranking signal; heavy images hurt SEO.</li>
                <li><strong>Email limits</strong> — see <a href="/guides/compress-image-for-email.html">compress for email</a>.</li>
                <li><strong>Marketplace uploads</strong> — Meesho, WhatsApp catalog, social posts.</li>
                <li><strong>Storage and bandwidth</strong> — especially on mobile data in India.</li>
            </ul>

            <h2 id="how-to">How to compress online (step-by-step)</h2>
            <ol>
                <li>Open the <a href="/tools/image-compressor/">Image Compressor</a>.</li>
                <li>Drag in your JPG, PNG, or WebP file.</li>
                <li>If the image is larger than needed, <a href="/tools/image-resizer/">resize</a> first (e.g. max 2000 px wide for web).</li>
                <li>Adjust the quality slider — start at <strong>80%</strong> and lower only if you need a smaller file.</li>
                <li>Preview and download. Compare file size before and after.</li>
            </ol>

            <h2 id="targets">File size targets by use case</h2>
            <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;margin:18px 0;">
                <thead><tr style="text-align:left;border-bottom:2px solid var(--border,#334155);"><th style="padding:8px;">Use case</th><th style="padding:8px;">Target</th></tr></thead>
                <tbody>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Website hero</td><td style="padding:8px;">100–300 KB</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Blog / article photo</td><td style="padding:8px;">50–150 KB</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Email attachment</td><td style="padding:8px;">200–500 KB each</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Meesho catalog</td><td style="padding:8px;">Under 50 KB at 600×600</td></tr>
                    <tr><td style="padding:8px;">WhatsApp share</td><td style="padding:8px;">200–500 KB</td></tr>
                </tbody>
            </table>
            </div>

            <h2 id="quality">Quality settings explained</h2>
            <p>JPEG quality is not linear. Dropping from 95% to 85% saves a lot of bytes with little visible change. Dropping below 60% causes blocky artifacts on faces and product edges. For seller photos, stay between <strong>75% and 90%</strong>.</p>

            <h2 id="mistakes">Common mistakes</h2>
            <ul>
                <li>Compressing without resizing — a 4000 px wide image wastes KB even at high quality.</li>
                <li>Saving the only copy — always keep the original master file.</li>
                <li>Using PNG for photos — switch to JPG unless you need transparency.</li>
                <li>Re-compressing the same JPEG multiple times — quality stacks downward.</li>
            </ul>`,
  },
  {
    slug: 'how-to-resize-image-online.html',
    title: 'How to Resize an Image Online — Free & Private (2026) — FastImageTool',
    headline: 'How to Resize an Image Online — Free and Private',
    description:
      'Resize images to exact pixels for Instagram, YouTube, email, and marketplaces. Free online resizer — runs in your browser, no signup.',
    breadcrumb: 'Resize Images Online',
    h1: 'How to Resize an Image Online',
    subtitle: 'Change width and height to exact pixels for social media, websites, and seller platforms.',
    readMin: 8,
    metaTag: '↔️ Image Resizer guide',
    toolSlug: 'image-resizer',
    ctaHref: '/tools/image-resizer/',
    ctaLabel: 'Resize Free',
    footerCtaTitle: 'Resize to exact pixels',
    footerCtaSub: 'Free Image Resizer — mobile and desktop',
    sidebar: [
      ['/tools/image-resizer/', 'Image Resizer'],
      ['/tools/image-crop/', 'Crop Image'],
      ['/tools/image-compressor/', 'Image Compressor'],
    ],
    related: [
      ['/guides/resize-image-for-instagram.html', 'Instagram Image Sizes 2026'],
      ['/guides/resize-image-for-youtube-thumbnail.html', 'YouTube Thumbnail Size'],
      ['/guides/resize-image-online.html', 'Resize Image Online — Quick Guide'],
    ],
    faqs: [
      [
        'How do I resize an image without distorting it?',
        'Lock the aspect ratio when changing one dimension, or crop to the target ratio first (e.g. 1:1 for square) then resize. Never stretch a portrait into a square without cropping.',
      ],
      [
        'Does resizing reduce image quality?',
        'Shrinking a large image to a smaller size usually looks sharp. Enlarging a small image makes it soft because new pixels are invented — always start from the largest original you have.',
      ],
      [
        'What size should I resize images for a website?',
        'Match the display size on your page. If the image shows at 800 px wide, export at 800 px (or 1600 px for retina). Oversized images waste bandwidth.',
      ],
      [
        'Can I resize images on my phone?',
        'Yes. FastImageTool runs in the mobile browser — open the resizer, upload from your gallery, enter dimensions, and download.',
      ],
      [
        'Is the online resizer private?',
        'Yes. Processing happens in your browser; files are not uploaded to our servers.',
      ],
    ],
    body: `
            <div class="inline-tool-cta"><div class="cta-icon">↔️</div><div class="cta-text"><strong>Try it free: Image Resizer</strong><span>Exact pixels — no signup</span></div><a href="/tools/image-resizer/" class="cta-btn">Use Tool →</a></div>
            <p>Every platform wants different pixel dimensions — Instagram feed, YouTube thumbnails, Meesho 600×600, Amazon 2000 px zoom. Resizing is how you match those specs without letting an app crop your product out of frame. This guide explains how to resize online safely and which sizes matter most in 2026.</p>

            <h2 id="common-sizes">Common resize targets</h2>
            <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;margin:18px 0;">
                <thead><tr style="text-align:left;border-bottom:2px solid var(--border,#334155);"><th style="padding:8px;">Platform</th><th style="padding:8px;">Size (px)</th></tr></thead>
                <tbody>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Instagram portrait post</td><td style="padding:8px;">1080 × 1350</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">YouTube thumbnail</td><td style="padding:8px;">1280 × 720</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Meesho catalog</td><td style="padding:8px;">600 × 600</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Amazon main (zoom)</td><td style="padding:8px;">2000 × 2000 (longest side)</td></tr>
                    <tr><td style="padding:8px;">General web content</td><td style="padding:8px;">1200–2000 px wide</td></tr>
                </tbody>
            </table>
            </div>
            <p>Deep dives: <a href="/guides/resize-image-for-instagram.html">Instagram sizes</a> · <a href="/guides/resize-image-for-youtube-thumbnail.html">YouTube thumbnails</a></p>

            <h2 id="how-to">How to resize online</h2>
            <ol>
                <li>Open the <a href="/tools/image-resizer/">Image Resizer</a>.</li>
                <li>Upload your image (JPG, PNG, or WebP).</li>
                <li>Enter target width and height — lock aspect ratio if the shape already matches.</li>
                <li>If the shape is wrong, <a href="/tools/image-crop/">crop</a> to ratio first, then resize.</li>
                <li>Download. Optionally <a href="/tools/image-compressor/">compress</a> if the file is still large.</li>
            </ol>

            <h2 id="dpi">Pixels vs DPI (for print)</h2>
            <p>Screen work is measured in <strong>pixels</strong>. DPI only matters for print — a 300 DPI label is meaningless for Instagram. For online use, ignore DPI and set the pixel dimensions the platform lists.</p>

            <h2 id="mistakes">Mistakes to avoid</h2>
            <ul>
                <li>Upscaling small screenshots — they will look blurry.</li>
                <li>Wrong aspect ratio — causes automatic cropping on social apps.</li>
                <li>Resizing without compressing after — a 2000 px JPG can still be several MB.</li>
            </ul>`,
  },
  {
    slug: 'how-to-convert-jpg-to-png.html',
    title: 'How to Convert JPG to PNG Online — Free & Private (2026) — FastImageTool',
    headline: 'How to Convert JPG to PNG Online',
    description:
      'Convert JPG to PNG for transparency-ready graphics, lossless archives, and design workflows. Free browser converter — no upload to server.',
    breadcrumb: 'JPG to PNG',
    h1: 'How to Convert JPG to PNG',
    subtitle: 'When you need PNG format — and how to convert without installing software.',
    readMin: 7,
    metaTag: '🔄 JPG to PNG guide',
    toolSlug: 'jpg-to-png',
    ctaHref: '/tools/jpg-to-png/',
    ctaLabel: 'Convert Free',
    footerCtaTitle: 'Convert JPG to PNG now',
    footerCtaSub: 'Instant, private, in your browser',
    sidebar: [
      ['/tools/jpg-to-png/', 'JPG to PNG'],
      ['/tools/png-to-jpg/', 'PNG to JPG'],
      ['/tools/image-compressor/', 'Image Compressor'],
    ],
    related: [
      ['/guides/webp-vs-jpg-which-is-better.html', 'WebP vs JPG'],
      ['/guides/how-to-convert-png-to-jpg.html', 'How to Convert PNG to JPG'],
      ['/guides/amazon-india-product-image-requirements.html', 'Amazon India Images'],
    ],
    faqs: [
      [
        'Why convert JPG to PNG?',
        'PNG supports transparency and lossless compression — useful for logos, graphics, and editing workflows. Note: converting a JPG to PNG does not restore quality lost in JPEG compression.',
      ],
      [
        'Will PNG be larger than JPG?',
        'Almost always yes for photographs. PNG is best for graphics with flat colors or transparency, not for camera photos.',
      ],
      [
        'Can JPG have transparency after converting to PNG?',
        'No. JPG has no transparency channel. The PNG will still have a solid background unless you edit it out in design software.',
      ],
      [
        'Is the converter free and private?',
        'Yes. FastImageTool processes files in your browser with no signup and no server upload.',
      ],
      [
        'Should Amazon sellers use PNG?',
        'Main product photos should be JPG on white. Use PNG only when your workflow or category specifically requires it.',
      ],
    ],
    body: `
            <div class="inline-tool-cta"><div class="cta-icon">🔄</div><div class="cta-text"><strong>Try it free: JPG to PNG</strong><span>One-click conversion in browser</span></div><a href="/tools/jpg-to-png/" class="cta-btn">Use Tool →</a></div>
            <p>JPG is perfect for photos; PNG is perfect for graphics, screenshots, and anything that might need a transparent background later. Converting between them is common in design and e-commerce workflows — but it is not magic. Understanding <em>why</em> you are converting saves you from huge files and disappointed clients.</p>

            <h2 id="when">When to convert JPG → PNG</h2>
            <ul>
                <li><strong>Design handoff</strong> — your editor or marketplace template expects PNG.</li>
                <li><strong>Further editing</strong> — PNG is lossless on re-save (unlike re-saving JPG).</li>
                <li><strong>Graphics with text</strong> — PNG keeps edges sharper than JPG for flat color artwork.</li>
                <li><strong>Preparing for background removal</strong> — some tools prefer PNG input (you still need to remove the background separately).</li>
            </ul>

            <h2 id="when-not">When NOT to convert</h2>
            <ul>
                <li><strong>Product photos for Amazon/Meesho</strong> — upload JPG unless rules say otherwise.</li>
                <li><strong>Email or WhatsApp</strong> — PNG photos are often much larger; use <a href="/tools/png-to-jpg/">PNG to JPG</a> instead.</li>
                <li><strong>Expecting better quality</strong> — you cannot recover detail JPEG already discarded.</li>
            </ul>

            <h2 id="how-to">How to convert online</h2>
            <ol>
                <li>Open <a href="/tools/jpg-to-png/">JPG to PNG Converter</a>.</li>
                <li>Upload your JPEG file.</li>
                <li>Download the PNG instantly.</li>
                <li>If the PNG is too large for web, consider whether JPG was the right format — or <a href="/tools/image-compressor/">compress</a> after confirming PNG is required.</li>
            </ol>

            <h2 id="compare">JPG vs PNG quick comparison</h2>
            <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;margin:18px 0;">
                <thead><tr style="text-align:left;border-bottom:2px solid var(--border,#334155);"><th style="padding:8px;"></th><th style="padding:8px;">JPG</th><th style="padding:8px;">PNG</th></tr></thead>
                <tbody>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Photos</td><td style="padding:8px;">✓ Best</td><td style="padding:8px;">Large files</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Transparency</td><td style="padding:8px;">✗</td><td style="padding:8px;">✓</td></tr>
                    <tr><td style="padding:8px;">Lossless</td><td style="padding:8px;">✗</td><td style="padding:8px;">✓</td></tr>
                </tbody>
            </table>
            </div>`,
  },
  {
    slug: 'resize-image-online.html',
    title: 'Resize Image Online Free — Exact Pixels, No Signup (2026) — FastImageTool',
    headline: 'Resize Image Online Free — Exact Pixels',
    description:
      'Resize photos online to any width and height. Free, private, browser-based image resizer for social media, websites, and sellers.',
    breadcrumb: 'Resize Image Online',
    h1: 'Resize Image Online (Free)',
    subtitle: 'Change image dimensions in seconds — works on desktop and mobile, no account required.',
    readMin: 6,
    metaTag: '↔️ Quick resize guide',
    toolSlug: 'image-resizer',
    ctaHref: '/tools/image-resizer/',
    ctaLabel: 'Resize Free',
    footerCtaTitle: 'Open the free resizer',
    footerCtaSub: 'Exact pixels — your files stay on your device',
    sidebar: [
      ['/tools/image-resizer/', 'Image Resizer'],
      ['/tools/image-compressor/', 'Image Compressor'],
      ['/tools/image-crop/', 'Crop Image'],
    ],
    related: [
      ['/guides/how-to-resize-image-online.html', 'Full Resize Guide'],
      ['/guides/resize-image-for-instagram.html', 'Instagram Sizes'],
      ['/guides/resize-image-for-youtube-thumbnail.html', 'YouTube Thumbnail Size'],
    ],
    faqs: [
      [
        'How do I resize an image online for free?',
        'Open FastImageTool Image Resizer, upload your file, enter width and height, and download. No signup and no server upload.',
      ],
      [
        'What is the best free online image resizer?',
        'Look for browser-based tools that do not upload your photos to a server. FastImageTool processes images locally for privacy.',
      ],
      [
        'Can I resize to Instagram or YouTube sizes?',
        'Yes. Use 1080×1350 for Instagram portrait, 1280×720 for YouTube thumbnails, or see our dedicated platform guides.',
      ],
      [
        'Will resizing make my image blurry?',
        'Shrinking usually stays sharp. Enlarging a small image causes blur — start from the highest resolution original.',
      ],
      [
        'What file formats are supported?',
        'JPG, PNG, and WebP are commonly supported in browser-based resizers including FastImageTool.',
      ],
    ],
    body: `
            <div class="inline-tool-cta"><div class="cta-icon">↔️</div><div class="cta-text"><strong>Resize now</strong><span>Free Image Resizer — no signup</span></div><a href="/tools/image-resizer/" class="cta-btn">Use Tool →</a></div>
            <p>You need a photo at exactly 1080×1350 for Instagram, 600×600 for a marketplace, or 800 px wide for your blog — but your camera gave you 4000×3000. An online resizer fixes that in seconds without installing Photoshop or a mobile app that adds watermarks.</p>

            <h2 id="why">Why resize before you upload?</h2>
            <ul>
                <li>Social apps crop and compress oversized uploads — you lose control.</li>
                <li>Seller platforms reject or slow-walk huge files.</li>
                <li>Websites load faster with right-sized images (better SEO).</li>
            </ul>

            <h2 id="steps">Three steps</h2>
            <ol>
                <li>Go to the <a href="/tools/image-resizer/">Image Resizer</a>.</li>
                <li>Upload and type your target width and height.</li>
                <li>Download — then <a href="/tools/image-compressor/">compress</a> if needed.</li>
            </ol>

            <h2 id="popular">Popular sizes</h2>
            <ul>
                <li><strong>Instagram portrait:</strong> 1080 × 1350 — <a href="/guides/resize-image-for-instagram.html">full guide</a></li>
                <li><strong>YouTube thumbnail:</strong> 1280 × 720 — <a href="/guides/resize-image-for-youtube-thumbnail.html">full guide</a></li>
                <li><strong>Meesho:</strong> 600 × 600 — <a href="/guides/meesho-product-image-size-600x600-under-50kb.html">seller guide</a></li>
            </ul>

            <p>For a deeper walkthrough, see <a href="/guides/how-to-resize-image-online.html">How to Resize an Image Online</a>.</p>`,
  },
];
