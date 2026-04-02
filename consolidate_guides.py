#!/usr/bin/env python3
"""
consolidate_guides.py — Find redundant *-guide-N.html clusters and merge them into pillar pages.

Pillar target (per tool_slug):
  1) data/pillar-overrides.json  (optional)  { "tool-slug": "pillar-slug-without-html" }
  2) Else first guide-data entry for that tool whose slug is NOT a numbered series
     (slugs matching *-guide-<n> are treated as redundant, not pillars).
  3) Among those, prefer slug starting with "how-to-", otherwise the first in file order.

If no pillar exists for a tool, that cluster is skipped until you add a proper guide row or an override.

Default is dry-run (no writes). Use --apply to update data/guide-data.json and optionally
--delete-sources to remove numbered guide HTML files after a successful merge, and
--prune-json to remove *-guide-<n> rows from guide-data for merged tools.

After --apply, regenerate HTML with: node scripts/create-guides.js

Requires: Python 3.9+
"""

from __future__ import annotations

import argparse
import html
import json
import re
import shutil
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path


# Filename pattern: e.g. jpg-to-png-guide-3.html, image-blur-guide-1.html
GUIDE_CLUSTER_RE = re.compile(
    r"^(?P<base>.+)-guide-(?P<num>[1-9]\d*)\.html$",
    re.IGNORECASE,
)

ROOT = Path(__file__).resolve().parent
GUIDES_DIR = ROOT / "guides"
DATA_FILE = ROOT / "data" / "guide-data.json"
REPORT_FILE = ROOT / "data" / "consolidation-report.json"
OVERRIDES_FILE = ROOT / "data" / "pillar-overrides.json"

# guide-data.json slug that belongs to the numbered HTML series (not a pillar)
REDUNDANT_SERIES_SLUG_RE = re.compile(r"^.+-guide-\d+$", re.IGNORECASE)
SAFE_ID_RE = re.compile(r"[^a-z0-9\-]+")


def _slugify(s: str) -> str:
    s = s.strip().lower().replace("_", "-").replace(" ", "-")
    s = SAFE_ID_RE.sub("-", s)
    s = re.sub(r"-{2,}", "-", s).strip("-")
    return s or "section"


@dataclass
class Cluster:
    base: str
    files: list[Path] = field(default_factory=list)

    def sorted_files(self) -> list[Path]:
        def key(p: Path) -> tuple[int, str]:
            m = GUIDE_CLUSTER_RE.match(p.name)
            if not m:
                return (0, p.name)
            return (int(m.group("num")), p.name)

        return sorted(self.files, key=key)


def load_guide_data() -> list[dict]:
    if not DATA_FILE.is_file():
        raise FileNotFoundError(f"Missing {DATA_FILE}")
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def load_pillar_overrides() -> dict[str, str]:
    if not OVERRIDES_FILE.is_file():
        return {}
    with open(OVERRIDES_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        return {}
    return {str(k): str(v) for k, v in data.items()}


def pillar_slug_for_tool(
    tool_slug: str, guides: list[dict], overrides: dict[str, str]
) -> str | None:
    """Pick canonical pillar slug for a tool."""
    if tool_slug in overrides:
        return overrides[tool_slug]
    matches = [g for g in guides if g.get("tool_slug") == tool_slug]
    if not matches:
        return None
    candidates: list[dict] = []
    for g in matches:
        slug = g.get("slug") or ""
        if not slug or REDUNDANT_SERIES_SLUG_RE.match(slug):
            continue
        candidates.append(g)
    if not candidates:
        return None
    for g in candidates:
        slug = g.get("slug") or ""
        if slug.startswith("how-to-"):
            return slug
    return candidates[0].get("slug")


def discover_clusters() -> dict[str, Cluster]:
    clusters: dict[str, Cluster] = defaultdict(lambda: Cluster(base=""))
    for path in GUIDES_DIR.glob("*.html"):
        if path.name == "index.html":
            continue
        m = GUIDE_CLUSTER_RE.match(path.name)
        if not m:
            continue
        base = m.group("base")
        if not clusters[base].base:
            clusters[base].base = base
        clusters[base].files.append(path)
    # Drop singletons (not a redundant cluster)
    return {k: v for k, v in clusters.items() if len(v.files) >= 2}


def extract_main_fragment(html: str) -> tuple[str, str]:
    """
    Return (title_guess, inner_html) from raw guide HTML.
    Title: first <h1> text, else <title>.
    Body: after </nav> until <footer or recommended-tools.
    """
    h1_m = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.IGNORECASE | re.DOTALL)
    title = _strip_tags(h1_m.group(1)) if h1_m else ""
    if not title:
        t_m = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
        title = _strip_tags(t_m.group(1)) if t_m else "Section"

    lower = html.lower()
    nav_end = lower.rfind("</nav>")
    start = nav_end + len("</nav>") if nav_end != -1 else lower.find("<body")
    if start == -1:
        start = 0
    chunk = html[start:]

    for stop in ('<footer', '<div class="recommended-tools"', '<div class="recommended-tools"'):
        idx = chunk.lower().find(stop.lower())
        if idx != -1:
            chunk = chunk[:idx]
            break

    chunk = re.sub(r"<div[^>]*class=\"guide-image\"[^>]*>.*?</div>", "", chunk, flags=re.DOTALL | re.IGNORECASE)
    return title.strip(), chunk.strip()


def _strip_tags(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s)).strip()


def _rewrite_headings(fragment_html: str, context: str) -> str:
    """
    Make headings unique + keep hierarchy inside the merged <section>.
    - Demote h2->h3 and h3->h4 (wrapper section owns the h2).
    - Prefix generic headings with the section context (avoids duplicates, helps SEO).
    """
    ctx = _strip_tags(context).strip() or "Guide"

    generic = {
        "introduction",
        "faq",
        "frequently asked questions",
        "conclusion",
        "tips",
        "step-by-step",
        "steps",
        "step by step",
        "alternative methods",
        "alternatives",
        "common issues",
    }

    def repl(m: re.Match) -> str:
        level = int(m.group("lvl"))
        inner = m.group("inner") or ""
        text = _strip_tags(inner)
        key = re.sub(r"\s+", " ", text).strip().lower()

        if text:
            if key in generic:
                inner_out = html.escape(f"{ctx}: {text}")
            elif inner == text:
                inner_out = html.escape(text)
            else:
                inner_out = inner
        else:
            inner_out = ""

        new_level = level + 1  # h2->h3, h3->h4
        return f"<h{new_level}>{inner_out}</h{new_level}>"

    return re.sub(
        r"<h(?P<lvl>[23])[^>]*>(?P<inner>.*?)</h(?P=lvl)>",
        repl,
        fragment_html,
        flags=re.IGNORECASE | re.DOTALL,
    )


def _make_section_title(tool_slug: str, file_path: Path, extracted_title: str) -> str:
    """
    Keyword-rich title for a merged section.
    Prefer extracted H1/title; fallback to filename-based.
    """
    title = extracted_title.strip()
    if title:
        return title
    m = GUIDE_CLUSTER_RE.match(file_path.name)
    num = m.group("num") if m else ""
    base = tool_slug.replace("-", " ").title() if tool_slug else "Guide"
    return f"{base} Guide Part {num}".strip()


def _ensure_pillar_entry(guides: list[dict], tool_slug: str, pillar_slug: str) -> dict | None:
    """
    If pillar_slug doesn't exist in guide-data, create a minimal pillar entry.
    Tool name is copied from any existing row with the same tool_slug.
    """
    for g in guides:
        if g.get("slug") == pillar_slug:
            return g

    sample = next((g for g in guides if g.get("tool_slug") == tool_slug), None)
    if not sample:
        return None

    tool_name = sample.get("tool_name") or tool_slug.replace("-", " ").title()
    nice = str(tool_name).strip() or tool_slug.replace("-", " ").title()

    entry = {
        "tool_slug": tool_slug,
        "tool_name": tool_name,
        "slug": pillar_slug,
        "title": f"How to Use {nice} – Complete Guide",
        "description": f"Complete guide to {nice}. Steps, tips, and troubleshooting.",
        "h1": f"How to Use {nice}",
        "content": f"<p>This pillar page consolidates our best {html.escape(nice)} tutorials into one guide.</p>",
        "date": datetime.now(timezone.utc).date().isoformat(),
    }
    guides.append(entry)
    return entry

def build_merged_content(
    pillar_entry: dict,
    cluster_files: list[Path],
    keep_pillar_intro: bool,
) -> str:
    parts: list[str] = []
    if keep_pillar_intro:
        intro = (pillar_entry.get("content") or "").strip()
        if intro:
            parts.append(intro)
            parts.append(
                '<h2 id="consolidated-series">In-depth topics (consolidated)</h2>'
                '<p class="pillar-merge-note">The sections below combine our former multi-part guide pages into one place.</p>'
            )

    for path in cluster_files:
        raw = path.read_text(encoding="utf-8", errors="replace")
        sec_title, fragment = extract_main_fragment(raw)
        section_title = _make_section_title(pillar_entry.get("tool_slug") or "", path, sec_title)
        safe_title = html.escape(_strip_tags(section_title)[:220])
        m = GUIDE_CLUSTER_RE.match(path.name)
        num = m.group("num") if m else "x"
        sec_id = f"{_slugify(pillar_entry.get('tool_slug') or 'tool')}-part-{num}"
        fragment = _rewrite_headings(fragment, safe_title)
        parts.append(
            f'<section class="pillar-merged-part" id="{sec_id}" data-merged-from="{html.escape(path.name)}">'
            f"<h2>{safe_title}</h2>\n{fragment}\n</section>"
        )

    return "\n".join(parts)


def run_apply(
    clusters: dict[str, Cluster],
    guides: list[dict],
    keep_pillar_intro: bool,
    delete_sources: bool,
    prune_json: bool,
    overrides: dict[str, str],
) -> None:
    backup = DATA_FILE.with_suffix(f".backup-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}.json")
    shutil.copy2(DATA_FILE, backup)
    print(f"Backed up guide-data to {backup.relative_to(ROOT)}")

    slug_to_index = {g["slug"]: i for i, g in enumerate(guides) if g.get("slug")}

    merged_count = 0
    skipped: list[str] = []
    deleted: list[str] = []
    merged_bases: list[str] = []
    pruned = 0

    for base, cluster in sorted(clusters.items()):
        pillar_slug = pillar_slug_for_tool(base, guides, overrides)
        if not pillar_slug:
            skipped.append(
                f"{base}: no pillar slug (add a non-*-guide-N guide row, or {OVERRIDES_FILE.name})"
            )
            continue

        # If an override points to a brand-new pillar slug, create it automatically.
        if pillar_slug not in slug_to_index:
            created = _ensure_pillar_entry(guides, base, pillar_slug)
            if not created:
                skipped.append(f"{base}: override pillar '{pillar_slug}' but no tool metadata found")
                continue
            slug_to_index = {g["slug"]: i for i, g in enumerate(guides) if g.get("slug")}

        idx = slug_to_index[pillar_slug]
        entry = guides[idx]
        new_content = build_merged_content(entry, cluster.sorted_files(), keep_pillar_intro)
        guides[idx]["content"] = new_content
        merged_count += 1
        merged_bases.append(base)

        if delete_sources:
            for f in cluster.sorted_files():
                f.unlink()
                deleted.append(str(f.relative_to(ROOT)))

    if prune_json and merged_bases:
        keep: list[dict] = []
        merged_set = set(merged_bases)
        for g in guides:
            ts = g.get("tool_slug")
            slug = g.get("slug") or ""
            if ts in merged_set and REDUNDANT_SERIES_SLUG_RE.match(slug):
                pruned += 1
                continue
            keep.append(g)
        guides.clear()
        guides.extend(keep)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(guides, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Updated {DATA_FILE.relative_to(ROOT)} — merged {merged_count} pillar(s).")
    if skipped:
        print("Skipped:")
        for s in skipped:
            print(f"  - {s}")
    if deleted:
        print(f"Deleted {len(deleted)} numbered guide file(s).")
    if prune_json and pruned:
        print(f"Pruned {pruned} redundant *-guide-<n> row(s) from guide-data for merged tools.")
    print("Next: run  node scripts/create-guides.js  to regenerate guides/*.html from JSON.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write merged HTML into guide-data.json pillar entries (creates timestamped backup).",
    )
    parser.add_argument(
        "--delete-sources",
        action="store_true",
        help="With --apply, delete *-guide-N.html files after merge (only for successfully mapped clusters).",
    )
    parser.add_argument(
        "--no-keep-pillar-intro",
        action="store_true",
        help="Replace pillar content entirely with merged sections (default keeps existing short intro).",
    )
    parser.add_argument(
        "--write-report",
        action="store_true",
        help=f"Write JSON report to {REPORT_FILE.relative_to(ROOT)}.",
    )
    parser.add_argument(
        "--prune-json",
        action="store_true",
        help="With --apply, remove guide-data rows whose slug matches *-guide-<n> for successfully merged tools.",
    )
    args = parser.parse_args()
    keep_pillar_intro = not args.no_keep_pillar_intro

    guides = load_guide_data()
    overrides = load_pillar_overrides()
    clusters = discover_clusters()

    report: dict = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "cluster_count": len(clusters),
        "overrides_file": str(OVERRIDES_FILE.relative_to(ROOT)),
        "overrides_loaded": bool(overrides),
        "clusters": {},
    }

    print(f"Found {len(clusters)} redundant cluster(s) (2+ *-guide-N.html files with same base name).\n")

    for base, cluster in sorted(clusters.items()):
        pillar_slug = pillar_slug_for_tool(base, guides, overrides)
        files = [str(p.relative_to(ROOT)) for p in cluster.sorted_files()]
        slug_set = {g.get("slug") for g in guides}
        report["clusters"][base] = {
            "files": files,
            "pillar_slug": pillar_slug,
            "pillar_ok": pillar_slug is not None and pillar_slug in slug_set,
        }
        if pillar_slug:
            status = f"-> pillar slug: {pillar_slug}"
        else:
            status = f"-> NO pillar (see {OVERRIDES_FILE.name} or add how-to-* guide for tool)"
        print(f"  [{base}] {len(cluster.files)} files {status}")
        for fp in files:
            print(f"      {fp}")

    if args.write_report:
        REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(REPORT_FILE, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
            f.write("\n")
        print(f"\nWrote {REPORT_FILE.relative_to(ROOT)}")

    if args.apply:
        if args.prune_json and not args.delete_sources:
            print("Note: --prune-json is most useful with --delete-sources so HTML and JSON stay in sync.")
        run_apply(
            clusters,
            guides,
            keep_pillar_intro,
            args.delete_sources,
            args.prune_json,
            overrides,
        )
    else:
        print("\nDry-run only. Use --apply to merge into guide-data.json (see --help).")


if __name__ == "__main__":
    main()
