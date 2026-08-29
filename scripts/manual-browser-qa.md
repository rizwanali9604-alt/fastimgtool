# Manual browser QA — HEIC, TIFF, compressor (≈10 minutes)

This is the **permanent** close for real-browser HEIC / TIFF / Web Worker checks. This environment has Chrome installed and does **not** have Playwright, Puppeteer, or a browser MCP. Do not re-open that as an engineering ticket.

Use **Chrome**. Stay on https://fastimgtool.com (production).

## Files

| Step | File | Where to get it |
| --- | --- | --- |
| HEIC | One iPhone photo (`.heic` / `.heif`) | Camera Roll → share to this PC. If you have no iPhone, skip HEIC and write N/A. |
| TIFF | `fixtures/qa-scan.tiff` | In this repo (tiny red 64×48 sample). |
| Compressor | Any photo **larger than ~400 KB** | Phone gallery or a marketplace product shot. `assets/og-image.png` is too small to prove the worker. |

## 1. HEIC → JPG (2 min)

1. Open https://fastimgtool.com/tools/heic-to-jpg/
2. Drop the `.heic` on the upload zone (not only the hidden file input).
3. Preview must appear. Download must enable.
4. Save the file. It must be a `.jpg` you can open in Photos.
5. Drop a `.png` instead: it must be **rejected**.

Fail if: zone does nothing, download stays disabled, or output is still HEIC.

## 2. TIFF → JPG (2 min)

1. Open https://fastimgtool.com/tools/tiff-to-jpg/
2. Drop `fixtures/qa-scan.tiff`.
3. Preview must appear. Download a `.jpg`.
4. Open it: solid red (or near-red) rectangle, not a broken image.

Fail if: upload zone is dead or the page never enables download.

## 3. Compressor Web Worker (4 min)

1. Open DevTools → Network. Confirm `/assets/vendor/browser-image-compression.js` is **200** from `fastimgtool.com` (not a CDN).
2. Open https://fastimgtool.com/tools/image-compressor/
3. Drop the >400 KB photo.
4. Click compress. Progress must move. Stats must show a **smaller** output than the original.
5. Download. Open the file. It must look like the photo, not empty/corrupt.

Fail if: progress never moves, output is larger with default settings, or the page throws in the console about the worker/`importScripts`.

## 4. Record (1 min)

Date, Chrome version, pass/fail per step. Email yourself or note in AdSense prep. **Once recorded, this item is closed.**
