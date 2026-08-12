#!/usr/bin/env python3
"""Regenerate the JS-wrapped copies of the JSON datasets.

The prototype prefers the plain .json files, but `fetch()` is blocked by CORS
over `file://` — so opening index.html straight off disk used to leave a blank
page. These generated .js files are loaded as ordinary <script> tags, which
file:// does allow, and act as the fallback source.

Run after editing data/dinosaurs.json or data/world-countries.geo.json:

    python3 tools/bundle-data.py
"""

import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

BUNDLES = [
    ("dinosaurs.json", "dinosaurs.data.js", "DINO_DATA"),
    ("world-countries.geo.json", "world.data.js", "DINO_WORLD"),
    # Regenerate the source with tools/fetch-occurrences.py first.
    ("occurrences.json", "occurrences.data.js", "DINO_OCCURRENCES"),
    # Regenerate the source with tools/fetch-news.py first.
    ("news.json", "news.data.js", "DINO_NEWS"),
]


def main():
    for source, target, global_name in BUNDLES:
        payload = json.loads((DATA / source).read_text())
        (DATA / target).write_text(
            f"// Generated from {source} by tools/bundle-data.py — do not edit by hand.\n"
            f"// Exists so the prototype also runs from file://, where fetch() is blocked by CORS.\n"
            f"window.{global_name} = {json.dumps(payload, separators=(',', ':'))};\n"
        )
        size = (DATA / target).stat().st_size // 1024
        print(f"{target}: {size} KB")


if __name__ == "__main__":
    main()
