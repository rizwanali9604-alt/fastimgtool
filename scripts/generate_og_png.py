#!/usr/bin/env python3
"""Generate assets/og-image.png (1200x630) for Open Graph meta tags."""
from PIL import Image, ImageDraw, ImageFont

from pathlib import Path

W, H = 1200, 630
img = Image.new("RGB", (W, H), "#7C3AED")
draw = ImageDraw.Draw(img)

draw.rectangle([60, 60, 60 + 1080, 60 + 510], fill=(255, 255, 255, 26))
draw.rectangle([0, 540, W, H], fill=(0, 0, 0, 51))

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

draw.text((100, 150), "FastImageTool", fill="#ffffff", font=font(52, True))
draw.text((100, 240), "Free Image Tools for Meesho & Amazon Sellers", fill=(255, 255, 255, 230), font=font(32))
draw.text((100, 300), "Compress - Resize - Convert - No Signup Required", fill=(255, 255, 255, 180), font=font(24))
draw.text((100, 565), "fastimgtool.com", fill="#ffffff", font=font(22))

out = Path(__file__).resolve().parent.parent / "assets" / "og-image.png"
img.save(out, "PNG", optimize=True)
print(f"Wrote {out}")
