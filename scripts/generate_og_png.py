#!/usr/bin/env python3
"""Generate a 1200x630 OG PNG. Prefer: node scripts/generate-og-image.js"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
img = Image.new("RGB", (W, H), "#050b18")
draw = ImageDraw.Draw(img)
draw.rounded_rectangle([48, 48, 1152, 582], radius=20, fill="#0b1225", outline="#1e293b", width=2)
draw.rectangle([48, 500, 1152, 582], fill="#111a30")


def font(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


draw.text((96, 168), "FastImageTool", fill="#4da3ff", font=font(56, True))
draw.text((96, 250), "Browser compressor, resizer and converters", fill="#e6edf7", font=font(32))
draw.text((96, 318), "For Meesho and Amazon sellers. One file at a time. No signup.", fill="#a0b3d9", font=font(24))
draw.text((96, 528), "fastimgtool.com", fill="#94a3b8", font=font(22))

out = Path(__file__).resolve().parent.parent / "assets" / "og-image.png"
img.save(out, "PNG", optimize=True)
print(f"Wrote {out}")
