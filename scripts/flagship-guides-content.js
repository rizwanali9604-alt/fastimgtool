/** Content definitions for scripts/write_flagship_guides.js */
module.exports = [
  {
    slug: 'webp-vs-jpg-which-is-better.html',
    title: 'WebP vs JPG: Which Format Is Better in 2026? — FastImageTool',
    headline: 'WebP vs JPG: Which Format Is Better in 2026?',
    description:
      'WebP vs JPG compared — file size, quality, browser support, and when to use each. Free converter tools for photos, websites, and seller listings.',
    breadcrumb: 'WebP vs JPG',
    h1: 'WebP vs JPG: Which Format Should You Use?',
    subtitle: 'Smaller files vs universal compatibility — a practical comparison for websites, email, and product photos.',
    readMin: 7,
    metaTag: '🖼️ Format guide',
    toolSlug: 'webp-to-jpg',
    ctaHref: '/tools/webp-to-jpg/',
    ctaLabel: 'Convert WebP',
    footerCtaTitle: 'Need JPG instead of WebP?',
    footerCtaSub: 'Convert in your browser — no upload to server',
    sidebar: [
      ['/tools/webp-to-jpg/', 'WebP to JPG'],
      ['/tools/image-to-webp/', 'Image to WebP'],
      ['/tools/image-compressor/', 'Image Compressor'],
    ],
    related: [
      ['/guides/how-to-convert-image-to-webp.html', 'How to Convert Images to WebP'],
      ['/guides/compress-image-for-email.html', 'Compress Image for Email'],
      ['/guides/shopify-product-images-webp-compression.html', 'Shopify WebP Compression'],
    ],
    faqs: [
      [
        'Is WebP better than JPG?',
        'WebP usually produces smaller files at the same visible quality, which helps websites load faster. JPG is still better when you need maximum compatibility with older software, email clients, or marketplaces that only accept JPEG.',
      ],
      [
        'Can all browsers open WebP?',
        'All modern browsers (Chrome, Firefox, Safari, Edge) support WebP. Very old versions and some desktop apps may not — use JPG when you are unsure who will open the file.',
      ],
      [
        'Should I use WebP for Amazon or Meesho listings?',
        'Most Indian marketplaces expect JPG for product photos. Export JPG for uploads even if you use WebP on your own website.',
      ],
      [
        'Does converting JPG to WebP improve quality?',
        'No — converting an existing JPG to WebP cannot recover data already discarded by JPEG compression. Start from the highest-quality original when possible.',
      ],
      [
        'How do I convert WebP to JPG for free?',
        'Open FastImageTool WebP to JPG Converter, upload the file, and download JPEG. Processing runs in your browser; nothing is sent to a server.',
      ],
    ],
    body: `
            <div class="inline-tool-cta"><div class="cta-icon">🖼️</div><div class="cta-text"><strong>Try it free: WebP to JPG</strong><span>Convert when compatibility matters</span></div><a href="/tools/webp-to-jpg/" class="cta-btn">Use Tool →</a></div>
            <p>Every year more websites switch to <strong>WebP</strong> for faster loading, but <strong>JPG</strong> remains the default for email, printing, and most seller platforms. The right choice depends on where the image will be viewed — not which format is "newer." This guide compares both formats with real-world use cases so you can pick confidently.</p>

            <h2 id="comparison">WebP vs JPG at a glance</h2>
            <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;margin:18px 0;">
                <thead><tr style="text-align:left;border-bottom:2px solid var(--border,#334155);"><th style="padding:8px;">Factor</th><th style="padding:8px;">WebP</th><th style="padding:8px;">JPG</th></tr></thead>
                <tbody>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Typical file size</td><td style="padding:8px;">25–35% smaller at similar quality</td><td style="padding:8px;">Larger but predictable</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Transparency</td><td style="padding:8px;">Yes</td><td style="padding:8px;">No</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Compatibility</td><td style="padding:8px;">Modern browsers &amp; apps</td><td style="padding:8px;">Universal</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Best for</td><td style="padding:8px;">Websites, Shopify, blogs</td><td style="padding:8px;">Email, marketplaces, print</td></tr>
                    <tr><td style="padding:8px;">Compression</td><td style="padding:8px;">Lossy or lossless</td><td style="padding:8px;">Lossy only</td></tr>
                </tbody>
            </table>
            </div>

            <h2 id="when-webp">When WebP is the better choice</h2>
            <ul>
                <li><strong>Your own website or Shopify store</strong> — smaller images improve Core Web Vitals and mobile speed. Use <a href="/tools/image-to-webp/">Image to WebP</a> on product photos after editing.</li>
                <li><strong>Blog and content sites</strong> — hero images and article photos load faster without visible quality loss.</li>
                <li><strong>You control the viewer</strong> — visitors use modern browsers; you can serve WebP with a JPG fallback via your CMS.</li>
            </ul>

            <h2 id="when-jpg">When JPG is the better choice</h2>
            <ul>
                <li><strong>Email attachments</strong> — recipients may use clients that mishandle WebP. See our <a href="/guides/compress-image-for-email.html">email compression guide</a>.</li>
                <li><strong>Amazon, Meesho, Flipkart listings</strong> — upload JPG unless the platform explicitly allows WebP.</li>
                <li><strong>Sharing with non-technical users</strong> — JPG opens everywhere with zero explanation.</li>
                <li><strong>Print workflows</strong> — labs and designers still expect JPEG or TIFF.</li>
            </ul>

            <h2 id="convert">How to convert between formats</h2>
            <p>Use browser-based tools so files stay private on your device:</p>
            <ol>
                <li><strong>WebP → JPG:</strong> <a href="/tools/webp-to-jpg/">WebP to JPG Converter</a> — one click download.</li>
                <li><strong>Any image → WebP:</strong> <a href="/tools/image-to-webp/">Image to WebP</a> — ideal before uploading to your site.</li>
                <li><strong>Still too large?</strong> Run through the <a href="/tools/image-compressor/">Image Compressor</a> at 75–85% quality.</li>
            </ol>

            <h2 id="mistakes">Common mistakes</h2>
            <ul>
                <li><strong>Uploading WebP to marketplaces</strong> that reject it — always check seller guidelines.</li>
                <li><strong>Converting JPG → WebP → JPG repeatedly</strong> — each lossy step degrades quality. Keep one master file.</li>
                <li><strong>Assuming smaller always means worse</strong> — WebP at 80% quality often beats JPG at 80% for the same file size.</li>
            </ul>`,
  },
  {
    slug: 'compress-image-for-whatsapp.html',
    title: 'Compress Image for WhatsApp — Smaller Photos, Faster Sends (2026) — FastImageTool',
    headline: 'Compress Image for WhatsApp — Smaller Photos, Faster Sends',
    description:
      'WhatsApp compresses photos automatically. Pre-compress images to control quality, save mobile data, and send faster. Free browser tool — no signup.',
    breadcrumb: 'Compress for WhatsApp',
    h1: 'How to Compress Images for WhatsApp',
    subtitle: 'Send photos faster on slow networks without ugly compression artifacts.',
    readMin: 6,
    metaTag: '📱 WhatsApp guide',
    toolSlug: 'image-compressor',
    ctaHref: '/tools/image-compressor/',
    ctaLabel: 'Compress Free',
    footerCtaTitle: 'Compress before you send',
    footerCtaSub: 'Free Image Compressor — works on phone',
    sidebar: [
      ['/tools/image-compressor/', 'Image Compressor'],
      ['/tools/image-resizer/', 'Image Resizer'],
      ['/tools/png-to-jpg/', 'PNG to JPG'],
    ],
    related: [
      ['/guides/how-to-compress-image-online.html', 'How to Compress Images Online'],
      ['/guides/compress-image-for-email.html', 'Compress Image for Email'],
      ['/guides/meesho-product-image-size-600x600-under-50kb.html', 'Meesho Image Size Guide'],
    ],
    faqs: [
      [
        'Does WhatsApp compress images?',
        'Yes. WhatsApp re-encodes photos when you send them as images (not as documents). Compression is aggressive on large files, which can soften detail. Pre-compressing lets you control the trade-off.',
      ],
      [
        'What size should images be for WhatsApp?',
        'For viewing on phones, 1280–1600 px on the long side and 200–500 KB file size is plenty. Larger files get squeezed harder by WhatsApp.',
      ],
      [
        'Should I send as document to avoid compression?',
        'Sending as a document preserves the file but recipients must download it — fine for work files, awkward for casual photos. Pre-compress instead for a better balance.',
      ],
      [
        'What quality setting should I use?',
        'Try 75–85% JPEG quality in the Image Compressor. Product photos and screenshots may need 85%; casual photos often look fine at 70%.',
      ],
      [
        'Is the compressor private?',
        'Yes. FastImageTool runs in your browser. Your WhatsApp photos are not uploaded to our servers.',
      ],
    ],
    body: `
            <div class="inline-tool-cta"><div class="cta-icon">🗜️</div><div class="cta-text"><strong>Try it free: Image Compressor</strong><span>Shrink photos before WhatsApp does it for you</span></div><a href="/tools/image-compressor/" class="cta-btn">Use Tool →</a></div>
            <p>WhatsApp is built for speed, not gallery-quality photos. When you attach a 5 MB camera roll image, the app re-compresses it — often more aggressively than you would choose yourself. <strong>Pre-compressing</strong> gives you smaller uploads, faster sends on 4G, and usually <em>better</em> results than letting WhatsApp crush a huge original.</p>

            <h2 id="limits">What WhatsApp does to your photos</h2>
            <ul>
                <li>Resizes very large images to a maximum dimension (varies by version; often around 1600–4096 px).</li>
                <li>Re-encodes as JPEG with lossy compression.</li>
                <li>Applies stronger compression on slow connections.</li>
            </ul>
            <p>You cannot turn this off for normal image sends. The workaround is to send a file that is already optimized.</p>

            <h2 id="how-to">Step-by-step: compress for WhatsApp</h2>
            <ol>
                <li>Open the <a href="/tools/image-compressor/">Image Compressor</a> on your phone or desktop browser.</li>
                <li>Upload the photo (JPG or PNG).</li>
                <li>If the image is over 2000 px wide, <a href="/tools/image-resizer/">resize</a> to 1600 px on the long side first.</li>
                <li>Set quality to <strong>75–85%</strong> and check the output size (aim for 200–500 KB for most photos).</li>
                <li>Download and send through WhatsApp as usual.</li>
            </ol>

            <h2 id="tips">Tips for sellers and groups</h2>
            <ul>
                <li><strong>Product catalog photos:</strong> square 800–1200 px, under 300 KB — fast for buyers on mobile data.</li>
                <li><strong>Screenshots with text:</strong> PNG compresses poorly; convert to JPG unless text must stay pixel-perfect.</li>
                <li><strong>Batch sharing:</strong> compress each image once; avoid forwarding already-forwarded WhatsApp images (quality stacks badly).</li>
            </ul>

            <h2 id="mistakes">Mistakes to avoid</h2>
            <ul>
                <li>Sending 4000×3000 originals — WhatsApp will hammer them anyway.</li>
                <li>Compressing below 60% quality — blocky faces and muddy product details.</li>
                <li>Using "document" for every photo — recipients hate unexpected downloads.</li>
            </ul>`,
  },
  {
    slug: 'meesho-product-image-size-600x600-under-50kb.html',
    title: 'Meesho Product Image 600×600 Under 50KB — Seller Guide 2026 — FastImageTool',
    headline: 'Meesho Product Image 600×600 Under 50KB',
    description:
      'Meesho listing photos: resize to 600×600 px and compress under 50KB. Step-by-step for Indian sellers using free browser tools.',
    breadcrumb: 'Meesho Image Size',
    h1: 'Meesho Product Image: 600×600 px Under 50KB',
    subtitle: 'Prepare catalog photos that upload fast and look sharp on mobile.',
    readMin: 6,
    metaTag: '🇮🇳 Meesho sellers',
    toolSlug: 'image-compressor',
    ctaHref: '/tools/image-resizer/',
    ctaLabel: 'Resize Free',
    footerCtaTitle: 'Prep your Meesho listing',
    footerCtaSub: 'Resize + compress in the browser',
    sidebar: [
      ['/tools/image-resizer/', 'Image Resizer'],
      ['/tools/image-compressor/', 'Image Compressor'],
      ['/tools/png-to-jpg/', 'PNG to JPG'],
    ],
    related: [
      ['/guides/amazon-india-product-image-requirements.html', 'Amazon India Image Requirements'],
      ['/guides/compress-image-for-whatsapp.html', 'Compress for WhatsApp'],
      ['/guides/how-to-compress-image-online.html', 'How to Compress Images Online'],
    ],
    faqs: [
      [
        'What size should Meesho product images be?',
        'A square 600×600 px image is the practical target many Meesho sellers use for consistent catalog display and fast uploads. Always confirm the latest specs in your Meesho seller app.',
      ],
      [
        'Why keep Meesho images under 50KB?',
        'Smaller files upload faster on mobile networks, reduce failed uploads, and keep your catalog snappy when buyers scroll on budget phones.',
      ],
      [
        'JPG or PNG for Meesho?',
        'Use JPG for product photos on white or solid backgrounds. PNG is larger and rarely needed unless you have transparency (unusual for catalog shots).',
      ],
      [
        'My photo looks blurry after compressing — what went wrong?',
        'You may have started from a soft image or compressed below 65% quality. Shoot in good light, resize to 600×600 first, then compress gradually.',
      ],
      [
        'Can I batch process many SKUs?',
        'Process one image at a time in the browser, or bookmark this workflow for your team. Each SKU needs the same resize-then-compress steps.',
      ],
    ],
    body: `
            <div class="inline-tool-cta">
                <div class="cta-text"><strong>Quick fix</strong><span>Resize + compress in one flow</span></div>
                <a href="/tools/image-resizer/" class="cta-btn">Open Resizer →</a>
                <a href="/tools/image-compressor/" class="cta-btn">Open Compressor →</a>
            </div>
            <p>Meesho sellers often work from phone photos taken on the shop floor. Those originals can be 3–8 MB — too large for smooth catalog uploads. The workflow that works: <strong>crop to square → resize to 600×600 → compress under ~50KB</strong> while keeping the product sharp.</p>

            <h2 id="specs">Target specs (practical workflow)</h2>
            <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;margin:18px 0;">
                <thead><tr style="text-align:left;border-bottom:2px solid var(--border,#334155);"><th style="padding:8px;">Setting</th><th style="padding:8px;">Value</th></tr></thead>
                <tbody>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Dimensions</td><td style="padding:8px;">600 × 600 px (square)</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Format</td><td style="padding:8px;">JPG</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">File size goal</td><td style="padding:8px;">Under 50 KB</td></tr>
                    <tr><td style="padding:8px;">Quality</td><td style="padding:8px;">Typically 70–85% after resize</td></tr>
                </tbody>
            </table>
            </div>

            <h2 id="step1">Step 1 — Resize to 600×600</h2>
            <ol>
                <li>Open <a href="/tools/image-resizer/">Image Resizer</a>.</li>
                <li>Upload the product photo.</li>
                <li>Set width and height to <strong>600</strong> (crop to square first if needed).</li>
                <li>Download the resized JPG.</li>
            </ol>

            <h2 id="step2">Step 2 — Compress under 50KB</h2>
            <ol>
                <li>Open <a href="/tools/image-compressor/">Image Compressor</a>.</li>
                <li>Upload the 600×600 file.</li>
                <li>Lower quality until under 50 KB — usually 70–85% for well-lit product shots.</li>
                <li>Upload to your Meesho catalog.</li>
            </ol>

            <h2 id="mistakes">Common mistakes</h2>
            <ul>
                <li>Uploading full-resolution phone photos without resize.</li>
                <li>Using PNG for simple product-on-white shots (wastes KB).</li>
                <li>Over-compressing until fabric texture disappears — hurts conversions.</li>
            </ul>`,
  },
  {
    slug: 'amazon-india-product-image-requirements.html',
    title: 'Amazon India Product Image Requirements 2026 — Size & White Background — FastImageTool',
    headline: 'Amazon India Product Image Requirements 2026',
    description:
      'Amazon India main image rules: white background, minimum size, JPG format. Free tools to resize, compress, and convert for sellers.',
    breadcrumb: 'Amazon India Images',
    h1: 'Amazon India Product Image Requirements',
    subtitle: 'Main image checklist, size targets, and a fast prep workflow for Seller Central.',
    readMin: 7,
    metaTag: '🛒 Amazon sellers',
    toolSlug: 'image-compressor',
    ctaHref: '/tools/image-compressor/',
    ctaLabel: 'Compress Free',
    footerCtaTitle: 'Prep your main image',
    footerCtaSub: 'Resize, convert, compress — free in browser',
    sidebar: [
      ['/tools/image-resizer/', 'Image Resizer'],
      ['/tools/image-compressor/', 'Image Compressor'],
      ['/tools/png-to-jpg/', 'PNG to JPG'],
    ],
    related: [
      ['/guides/meesho-product-image-size-600x600-under-50kb.html', 'Meesho Image Size Guide'],
      ['/guides/how-to-resize-image-online.html', 'How to Resize Images Online'],
      ['/guides/png-to-jpg-for-sellers/', 'PNG to JPG for Sellers'],
    ],
    faqs: [
      [
        'What background does Amazon India require for the main image?',
        'The main product image should be on a pure white background (RGB 255, 255, 255) with the product filling about 85% of the frame. No text, logos, or props on the main image.',
      ],
      [
        'What is the minimum image size for Amazon India?',
        'Amazon typically requires at least 1000 px on the longest side for zoom on the product detail page; 2000 px is ideal for zoom quality. Verify current rules in Seller Central.',
      ],
      [
        'JPG or PNG for Amazon listings?',
        'JPG is preferred for photos. Use PNG only when transparency is required (uncommon for main images).',
      ],
      [
        'Can I use watermarks on Amazon product images?',
        'No on the main image. Secondary images may include infographics and lifestyle shots per Amazon category guidelines.',
      ],
      [
        'How do I reduce file size without losing sharpness?',
        'Resize to the exact pixel dimensions Amazon needs, export JPG at 85–90% quality, then use the Image Compressor only if the file is still unusually large.',
      ],
    ],
    body: `
            <div class="inline-tool-cta"><div class="cta-icon">🛒</div><div class="cta-text"><strong>Seller workflow</strong><span>Resize → convert → compress</span></div><a href="/tools/image-resizer/" class="cta-btn">Start Resizing →</a></div>
            <p>Amazon India's image rules exist so every product looks professional in search results and zoom works on mobile. A rejected main image delays your listing — this checklist matches what most India sellers need before uploading to Seller Central. <strong>Always confirm the latest rules in your seller account</strong> because categories can differ.</p>

            <h2 id="main-checklist">Main image checklist</h2>
            <ul>
                <li><strong>Background:</strong> Pure white (RGB 255,255,255) — no gradients or grey.</li>
                <li><strong>Product fill:</strong> Product occupies ~85% of the image.</li>
                <li><strong>No text or badges</strong> on the main image (offers belong in secondary images).</li>
                <li><strong>Sharp focus</strong> — no blur, no heavy filters.</li>
                <li><strong>Format:</strong> JPG for photographs.</li>
            </ul>

            <h2 id="sizes">Recommended dimensions</h2>
            <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;margin:18px 0;">
                <thead><tr style="text-align:left;border-bottom:2px solid var(--border,#334155);"><th style="padding:8px;">Use case</th><th style="padding:8px;">Size</th></tr></thead>
                <tbody>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Minimum (zoom enabled)</td><td style="padding:8px;">1000 px longest side</td></tr>
                    <tr style="border-bottom:1px solid #2a3550;"><td style="padding:8px;">Recommended</td><td style="padding:8px;">2000 × 2000 px square or proportional</td></tr>
                    <tr><td style="padding:8px;">File size</td><td style="padding:8px;">Under ~10 MB; smaller loads faster in Seller Central</td></tr>
                </tbody>
            </table>
            </div>

            <h2 id="workflow">FastImageTool workflow</h2>
            <ol>
                <li><a href="/tools/image-resizer/">Resize</a> so the longest side is 2000 px (or your category minimum).</li>
                <li>If exported as PNG from a studio shoot, <a href="/tools/png-to-jpg/">convert to JPG</a>.</li>
                <li><a href="/tools/image-compressor/">Compress</a> only if the file is still huge — stay above 80% quality for product detail.</li>
                <li>Upload main image first, then add lifestyle and infographic secondary images.</li>
            </ol>

            <h2 id="secondary">Secondary images</h2>
            <p>Lifestyle, size charts, and feature callouts belong in <strong>secondary</strong> slots — not on the main white-background hero. This is where you show scale, packaging, and use cases.</p>

            <h2 id="mistakes">Common rejection reasons</h2>
            <ul>
                <li>Off-white or grey background on the main image.</li>
                <li>Product too small in the frame.</li>
                <li>Promotional text ("Sale", "Best Seller") on the main image.</li>
                <li>Low resolution — image looks soft when zoomed.</li>
            </ul>`,
  },
];

// Part 2 — larger how-to guides (appended via second require in write script)
module.exports.push(
  ...require('./flagship-guides-content-part2.js')
);
