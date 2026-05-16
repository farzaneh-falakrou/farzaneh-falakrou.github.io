#!/usr/bin/env python3
"""
Follow all mod/url links in the Moodle page and index the final external URLs.
Outputs moodle_links.md with date, title, and resolved external link.

Usage:
    python3 index_links.py --cookie "MoodleSession=abc123; ..."
"""

import sys
import os
import re
import time
import requests
from urllib.parse import unquote

HTML_FILE = os.path.join(os.path.dirname(__file__), "Kurs_ B-B2-71 _ IIK-Moodle.html")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "moodle_links.md")


def parse_html(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        html = f.read()

    section_blocks = re.split(r'(?=<li[^>]+id="section-\d+"[^>]*>)', html)
    results = []
    seen_urls = set()

    for block in section_blocks:
        date_match = re.search(r'data-sectionname="(\d{2}\.\d{2}\.\d{4})"', block)
        date_str = None
        if date_match:
            raw = date_match.group(1)
            d, m, y = raw.split(".")
            date_str = f"{y}-{m}-{d}"

        # mod/url links only, exclude courseindex sidebar
        link_pattern = re.compile(
            r'<a(?![^>]*courseindex)[^>]+href="(https://moodle\.iik-deutschland\.de/mod/url/view\.php\?id=\d+)"[^>]*>(.*?)</a>',
            re.DOTALL
        )
        for m in link_pattern.finditer(block):
            url = m.group(1)
            if url in seen_urls:
                continue
            seen_urls.add(url)
            label = re.sub(r"<[^>]+>", "", m.group(2)).strip()
            label = re.sub(r"\s+", " ", label)
            label = re.sub(r"\s*Link/URL\s*$", "", label).strip()
            if label:
                results.append({"url": url, "date": date_str or "undatiert", "label": label})

    return results


def resolve_external_url(session, moodle_url):
    """Follow Moodle mod/url redirect to get the final external URL."""
    try:
        resp = session.get(moodle_url, timeout=20, allow_redirects=True)
        final = resp.url

        # If we ended up on a Moodle page, the external URL is embedded in the HTML
        if "moodle.iik-deutschland.de" in final:
            # Look for a redirect link or the actual external URL in the page
            m = re.search(r'<a[^>]+href="(https?://(?!moodle\.iik-deutschland\.de)[^"]+)"[^>]*>\s*(?:hier klicken|weiter|continue|click here|go to|öffnen|open|link|url)',
                          resp.text, re.IGNORECASE)
            if m:
                return m.group(1)
            # Fallback: find first external link on the page
            m = re.search(r'href="(https?://(?!moodle\.iik-deutschland\.de)[^"]{10,})"', resp.text)
            if m:
                return m.group(1)
            return final  # give up, return Moodle page URL

        return final
    except Exception as e:
        return f"ERROR: {e}"


def parse_cookie_string(s):
    cookies = {}
    for part in s.split(";"):
        part = part.strip()
        if "=" in part:
            k, v = part.split("=", 1)
            cookies[k.strip()] = v.strip()
    return cookies


def main():
    if len(sys.argv) < 3 or sys.argv[1] != "--cookie":
        print(__doc__)
        sys.exit(1)

    cookie_string = sys.argv[2]

    print(f"Parsing {HTML_FILE}...")
    links = parse_html(HTML_FILE)
    print(f"Found {len(links)} external link resources.\n")

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0"})
    session.cookies.update(parse_cookie_string(cookie_string))

    rows = []
    for i, item in enumerate(links, 1):
        print(f"[{i}/{len(links)}] {item['date']} / {item['label'][:60]}... ", end="", flush=True)
        ext_url = resolve_external_url(session, item["url"])
        print(ext_url[:80])
        rows.append({"date": item["date"], "label": item["label"], "url": ext_url})
        time.sleep(0.3)

    # Write markdown index
    rows.sort(key=lambda r: r["date"])
    current_date = None
    lines = ["# Externe Links — Kurs B2-71\n"]
    for row in rows:
        if row["date"] != current_date:
            current_date = row["date"]
            lines.append(f"\n## {current_date}\n")
        lines.append(f"- [{row['label']}]({row['url']})")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    print(f"\nSaved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
