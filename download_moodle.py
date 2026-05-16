#!/usr/bin/env python3
"""
Download all class materials from the saved Moodle HTML page.

Usage:
    python3 download_moodle.py --cookie "MoodleSession=abc123; othercookie=xyz"

    How to get the cookie string:
      1. Log in to moodle.iik-deutschland.de in Chrome or Firefox
      2. Open DevTools (Cmd+Option+I on Mac, F12 on Windows)
      3. Go to the Network tab, then refresh the Moodle page
      4. Click any request to moodle.iik-deutschland.de in the list
      5. In the Headers panel, scroll to "Request Headers" → find the "Cookie:" line
      6. Copy the entire value (everything after "Cookie: ")
      7. Run: python3 download_moodle.py --cookie "<paste here>"
"""

import sys
import os
import re
import time
import requests
from urllib.parse import unquote

HTML_FILE = os.path.join(os.path.dirname(__file__), "Kurs_ B-B2-71 _ IIK-Moodle.html")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "moodle_downloads")

FILE_CONTENT_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "application/zip",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/ogg",
    "audio/wav",
    "video/mp4",
    "image/png",
    "image/jpeg",
}


def parse_html(path):
    with open(path, encoding="utf-8", errors="replace") as f:
        html = f.read()

    section_blocks = re.split(r'(?=<li[^>]+id="section-\d+")', html)
    results = []
    seen_urls = set()

    for block in section_blocks:
        heading_match = re.search(r'<(?:h3|h4)[^>]*>(.*?)</(?:h3|h4)>', block, re.DOTALL)
        heading = "Allgemein"
        if heading_match:
            heading = re.sub(r"<[^>]+>", "", heading_match.group(1)).strip()
            heading = re.sub(r"\s+", " ", heading)

        link_pattern = re.compile(
            r'<a[^>]+href="(https://moodle\.iik-deutschland\.de/mod/resource/view\.php\?id=\d+)"[^>]*>(.*?)</a>',
            re.DOTALL
        )
        resources = []
        for m in link_pattern.finditer(block):
            url = m.group(1)
            if url in seen_urls:
                continue
            seen_urls.add(url)
            label = re.sub(r"<[^>]+>", "", m.group(2)).strip()
            label = re.sub(r"\s+", " ", label)
            label = re.sub(r"\s*Datei\s*$", "", label).strip()
            if label:
                resources.append({"label": label, "url": url})

        if resources:
            results.append({"heading": heading, "resources": resources})

    return results


def safe_filename(name):
    name = re.sub(r'[<>:"/\\|?*]', "_", name)
    name = name.strip(". ")
    return name[:120] if len(name) > 120 else name


def extract_pluginfile_url(html):
    """Find the actual file URL embedded in a Moodle resource page."""
    # First try: look for an audio/video/doc pluginfile URL (not favicon)
    candidates = re.findall(
        r'(https://moodle\.iik-deutschland\.de/pluginfile\.php/[^\s"\'<>]+)',
        html
    )
    for url in candidates:
        lower = url.lower().split("?")[0]
        if any(lower.endswith(ext) for ext in (
            ".mp3", ".mp4", ".ogg", ".wav", ".m4a",
            ".pdf", ".pptx", ".ppt", ".docx", ".doc", ".zip"
        )):
            return url
    return None


def download_resource(session, url, dest_dir, label):
    try:
        resp = session.get(url, timeout=30, allow_redirects=True)
        ct = resp.headers.get("Content-Type", "").split(";")[0].strip()

        # If we got HTML, the file is embedded in the page — extract the real URL
        if ct == "text/html":
            pluginfile_url = extract_pluginfile_url(resp.text)
            if not pluginfile_url:
                return None, "HTML response, no pluginfile URL found"
            resp = session.get(pluginfile_url, timeout=30, allow_redirects=True)
            ct = resp.headers.get("Content-Type", "").split(";")[0].strip()

        if resp.status_code != 200:
            return None, f"HTTP {resp.status_code}"

        if ct not in FILE_CONTENT_TYPES:
            return None, f"skipped (unrecognised type: {ct})"

        # Determine filename
        cd = resp.headers.get("Content-Disposition", "")
        fname = None
        m = re.search(r"filename\*=UTF-8''([^\s;]+)", cd, re.IGNORECASE)
        if m:
            fname = unquote(m.group(1))
        else:
            m = re.search(r'filename=["\']?([^"\';\r\n]+)', cd, re.IGNORECASE)
            if m:
                fname = unquote(m.group(1).strip())

        if not fname:
            path_part = resp.url.split("?")[0].rstrip("/")
            fname = unquote(path_part.split("/")[-1])

        if not fname or fname in ("view.php", ""):
            ext_map = {
                "application/pdf": ".pdf",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
                "application/vnd.ms-powerpoint": ".ppt",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
                "audio/mpeg": ".mp3",
                "video/mp4": ".mp4",
            }
            fname = label + ext_map.get(ct, "")

        dest_path = os.path.join(dest_dir, safe_filename(fname))
        if os.path.exists(dest_path):
            return os.path.basename(dest_path), None  # already downloaded, skip

        with open(dest_path, "wb") as f:
            f.write(resp.content)
        return os.path.basename(dest_path), None

    except Exception as e:
        return None, str(e)


def parse_cookie_string(cookie_string):
    cookies = {}
    for part in cookie_string.split(";"):
        part = part.strip()
        if "=" in part:
            k, v = part.split("=", 1)
            cookies[k.strip()] = v.strip()
    return cookies


def main():
    if len(sys.argv) < 2 or (sys.argv[1] == "--cookie" and len(sys.argv) < 3):
        print(__doc__)
        sys.exit(1)

    if sys.argv[1] != "--cookie":
        print("Error: only --cookie mode is supported. See usage above.")
        sys.exit(1)

    cookie_string = sys.argv[2]

    print(f"Parsing {HTML_FILE}...")
    sections = parse_html(HTML_FILE)
    total = sum(len(s["resources"]) for s in sections)
    print(f"Found {len(sections)} sections, {total} resources.\n")

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0"})
    session.cookies.update(parse_cookie_string(cookie_string))

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    ok = 0
    fail = 0
    count = 0

    for section in sections:
        heading = section["heading"]
        dest_dir = os.path.join(OUTPUT_DIR, safe_filename(heading) or "Allgemein")
        os.makedirs(dest_dir, exist_ok=True)

        for res in section["resources"]:
            count += 1
            label = res["label"]
            url = res["url"]
            print(f"[{count}/{total}] {heading[:35]} / {label[:45]}... ", end="", flush=True)
            fname, err = download_resource(session, url, dest_dir, label)
            if fname:
                print(f"✓ {fname}")
                ok += 1
            else:
                print(f"✗ {err}")
                fail += 1
            time.sleep(0.3)

    print(f"\nDone. {ok} downloaded, {fail} failed.")
    print(f"Files saved to: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
