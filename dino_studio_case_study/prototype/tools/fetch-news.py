#!/usr/bin/env python3
"""Fetch real, licensed dinosaur news headlines for the "Dino News" panel.

Run this to regenerate data/news.json, then `python3 tools/bundle-data.py`:

    python3 tools/fetch-news.py && python3 tools/bundle-data.py

Why RSS, and why only headline + short excerpt + link: RSS feeds are
published by these outlets specifically for syndication — showing a title, a
short summary, and a link back to the original article is the intended use
and needs no separate licence. What this script does NOT do is scrape or
republish full article bodies, images, or bylines; every item links out to
the source for the actual story, and each item is tagged with which outlet
it came from. That's the boundary that keeps this legal without needing a
content-licensing deal.

Sources:
  - ScienceDaily's own "Dinosaurs" feed — already scoped to the topic, so
    every item is used as-is.
  - Phys.org's general science feed — much broader, so items are kept only
    if the title or summary matches a dinosaur/paleontology keyword.

Data: ScienceDaily and Phys.org, via their public RSS feeds, (c) their
respective publishers. This script stores only what RSS syndication already
permits: title, link, publish date, source name, and the feed's own short
summary.
"""

import html
import json
import pathlib
import re
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

FEEDS = [
    {"url": "https://www.sciencedaily.com/rss/fossils_ruins/dinosaurs.xml", "source": "ScienceDaily", "filter": False},
    {"url": "https://phys.org/rss-feed/", "source": "Phys.org", "filter": True},
]

KEYWORDS = re.compile(
    r"\b(dinosaur|theropod|sauropod|ceratops|tyrannosaur|paleontolog|palaeontolog|"
    r"fossil|jurassic|cretaceous|triassic period|mesozoic)\w*\b",
    re.I,
)

MAX_ITEMS = 40


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "dino-studio-prototype (portfolio project)"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", "ignore")


def strip_html(text):
    # RSS descriptions are sometimes plain text, sometimes a fragment of
    # markup (a wrapped <p>, an <img>) — strip tags and collapse whitespace
    # so the panel only ever shows plain text, never stray markup.
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def truncate(text, limit):
    if len(text) <= limit:
        return text
    # Cut at the last whole word inside the limit rather than mid-word, so a
    # summary never ends on a dangling fragment like "Its close r".
    cut = text[:limit].rsplit(" ", 1)[0]
    return f"{cut}…"


def parse_items(xml_text):
    items = []
    for block in re.findall(r"<item>(.*?)</item>", xml_text, re.S):
        def field(tag):
            m = re.search(rf"<{tag}>(?:<!\[CDATA\[(.*?)\]\]>|(.*?))</{tag}>", block, re.S)
            if not m:
                return ""
            return (m.group(1) or m.group(2) or "").strip()

        items.append({
            "title": strip_html(field("title")),
            "link": field("link").strip(),
            "pubDate": field("pubDate").strip(),
            "summary": truncate(strip_html(field("description")), 280),
        })
    return items


def to_iso(pub_date):
    try:
        dt = parsedate_to_datetime(pub_date)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc).isoformat()
    except Exception:
        return None


def main():
    collected = []
    for feed in FEEDS:
        try:
            xml_text = fetch(feed["url"])
        except Exception as exc:  # network hiccup, feed moved, etc.
            print(f"skip {feed['source']}: {exc}")
            continue
        items = parse_items(xml_text)
        kept = 0
        for item in items:
            if feed["filter"] and not KEYWORDS.search(f"{item['title']} {item['summary']}"):
                continue
            iso = to_iso(item["pubDate"])
            if not item["title"] or not item["link"] or not iso:
                continue
            collected.append({
                "title": item["title"],
                "link": item["link"],
                "date": iso,
                "source": feed["source"],
                "summary": item["summary"],
            })
            kept += 1
        print(f"{feed['source']}: {kept}/{len(items)} items kept")

    # Same link can appear twice across runs/feeds; last-write-wins is fine
    # since content is identical.
    by_link = {item["link"]: item for item in collected}
    ordered = sorted(by_link.values(), key=lambda item: item["date"], reverse=True)[:MAX_ITEMS]

    target = DATA / "news.json"
    target.write_text(json.dumps(ordered, separators=(",", ":")))
    print(f"{len(ordered)} items -> {target.name} ({target.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
