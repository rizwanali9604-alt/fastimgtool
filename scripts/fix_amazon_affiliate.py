#!/usr/bin/env python3
"""Replace Amazon affiliate placeholders in divs containing 'Shop Amazon'."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
AMAZON = "https://www.amazon.in/s?k=photography+lighting+kit&tag=fastimgtool78-21"
PLACEHOLDER = "#affiliate-link-needed"


def fix_content(text: str) -> tuple[str, bool]:
    """Replace placeholder on aff-amazon links inside divs that contain 'Shop Amazon'."""
    changed = False
    pattern = re.compile(
        r'(<div class="affiliate-cta"[^>]*>.*?Shop Amazon.*?</div>)',
        re.DOTALL,
    )

    def repl_div(m: re.Match) -> str:
        nonlocal changed
        block = m.group(1)
        if PLACEHOLDER not in block or "aff-amazon" not in block:
            return block
        new_block, n = re.subn(
            re.escape(f'href="{PLACEHOLDER}"'),
            f'href="{AMAZON}"',
            block,
            count=1,
        )
        if n:
            changed = True
        return new_block

    text = pattern.sub(repl_div, text)
    return text, changed


def main() -> None:
    fixed: list[str] = []
    for path in ROOT.rglob("*"):
        if path.suffix not in {".html", ".js"}:
            continue
        if "node_modules" in path.parts or "guides_backup" in path.parts:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        new_text, changed = fix_content(text)
        if changed:
            path.write_text(new_text, encoding="utf-8")
            fixed.append(str(path.relative_to(ROOT)).replace("\\", "/"))

    print(f"Fixed {len(fixed)} files")
    for f in sorted(fixed):
        print(f"  {f}")

    remaining = []
    for path in ROOT.rglob("*.html"):
        if "node_modules" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="ignore")
        for m in re.finditer(r'<div class="affiliate-cta"[^>]*>.*?Shop Amazon.*?</div>', text, re.DOTALL):
            if PLACEHOLDER in m.group(0) and "aff-amazon" in m.group(0):
                remaining.append(str(path.relative_to(ROOT)))
                break
    if remaining:
        print(f"WARNING: {len(remaining)} files still have placeholders")
    else:
        print("All Shop Amazon affiliate-cta blocks updated.")


if __name__ == "__main__":
    main()
