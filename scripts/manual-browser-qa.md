# Manual browser QA — catalog tools (Chrome, production)

This environment has no Playwright, Puppeteer, or browser MCP. Chrome is installed on the operator’s machine. **Do not reopen “add automation” as an engineering ticket.** Record date, Chrome version, pass/fail. Once recorded, tool-function verification for AdSense prep is closed.

Stay on **https://fastimgtool.com**. Use one image at a time (the tools do not batch).

## Fixtures

| ID | File | Source |
| --- | --- | --- |
| JPEG | any `.jpg` catalog photo | phone/gallery |
| PNG | PNG with transparency (logo) | export from Canva or similar |
| WebP | `.webp` | Chrome save-as or compressor output |
| GIF | `.gif` | any short GIF |
| BMP | `.bmp` | Paint → Save as BMP |
| TIFF | `fixtures/qa-scan.tiff` | this repo (64×48 red) |
| HEIC | iPhone `.heic` | Camera Roll; skip and mark N/A if none |
| BIG | photo **>400 KB** | not `assets/og-image.png` |
| TXT | `notes.txt` | prove reject |

Shared fail: upload zone dead, download stays disabled after a valid file, output won’t open, or the wrong format is accepted.

---

## Catalog (16 indexable tools)

### image-compressor
INPUT: BIG JPEG. ACTION: Compress. EXPECTED: progress moves; stats show smaller output; download opens as a photo. Network: `/assets/vendor/browser-image-compression.js` is 200 from this origin. INPUT TXT: no compress.

### image-resizer
INPUT: JPEG wider than tall. ACTION: Meesho 600×600 (or typed 600×600). EXPECTED: square JPEG, product centered (cover-crop, not stretched). Not the same as Image Crop (no marketplace presets there).

### jpg-to-png
INPUT: JPEG. EXPECTED: `.png`, same pixel size, **opaque** (no invented alpha). INPUT PNG: rejected.

### png-to-jpg
INPUT: transparent PNG. EXPECTED: `.jpg`, transparent pixels **white**. Quality slider changes file size.

### webp-to-jpg
INPUT: WebP. EXPECTED: still `.jpg` (animation not kept). INPUT JPEG: rejected.

### png-to-webp
INPUT: PNG. EXPECTED: `.webp`. INPUT JPEG: **rejected** (use Image to WebP).

### image-to-webp
INPUT: JPEG (and optionally PNG/GIF). EXPECTED: `.webp`. Quality slider present. INPUT BMP if tested: rejected.

### gif-to-png
INPUT: GIF. EXPECTED: `.png` of **first frame** only, not an animated PNG. INPUT JPEG: rejected.

### bmp-to-jpg
INPUT: BMP. EXPECTED: `.jpg`. INPUT JPEG: rejected.

### tiff-to-jpg
INPUT: `fixtures/qa-scan.tiff`. EXPECTED: `.jpg` that opens as a red (or near-red) rectangle.

### heic-to-jpg
INPUT: HEIC. EXPECTED: preview then `.jpg`. INPUT PNG: rejected. N/A if no HEIC file.

### image-to-base64
INPUT: JPEG. EXPECTED: textarea/output with `data:image` or base64 text you can copy. Not a decoder.

### base64-to-image
INPUT: paste that string into the textarea (no file upload). EXPECTED: preview + download. INPUT `hello`: “Invalid image data” or download stays disabled.

### image-crop
INPUT: JPEG. ACTION: width/height smaller than source. EXPECTED: center crop, not a drag box. Empty width: error, no download.

### rotate-image
INPUT: JPEG. ACTION: 90°. EXPECTED: width/height swap. This is not Flip.

### flip-image
INPUT: JPEG with text. ACTION: horizontal. EXPECTED: text reversed. Vertical is a mirror, not 90° rotate.

---

## Noindex filters (optional, 2 min)

Open `/tools/image-blur/`. Confirm it still works as a slider preview. These eight URLs are **noindex** on purpose; they are not the AdSense catalog.

## Record

Date / Chrome / pass-fail per slug above. Email yourself. **Closed after one recorded pass.**
