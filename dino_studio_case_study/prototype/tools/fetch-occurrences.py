#!/usr/bin/env python3
"""Fetch fossil occurrence points for every dinosaur from the Paleobiology Database.

Run this to regenerate data/occurrences.json, then `python3 tools/bundle-data.py`:

    python3 tools/fetch-occurrences.py && python3 tools/bundle-data.py

Why this is a build step rather than a runtime call: the prototype has to work
offline and from file://, and PBDB is a third party that can be slow or down.
Prebaking means the map has no network dependency, no rate limit, no failure
mode, and no request-per-selection. The whole dataset is ~30 KB.

The dataset's `foundIn` field is a list of modern country names, which is why
the choropleth can only shade whole countries and has to drop "North Africa"
(a region with no polygon). Occurrence points have neither limitation.

Data: Paleobiology Database, CC BY 4.0. https://paleobiodb.org
"""

import json
import pathlib
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ENDPOINT = "https://paleobiodb.org/data1.2/occs/list.json"
# 3 decimal places is ~110 m at the equator — far finer than a dig site needs,
# and it roughly halves the payload against full precision.
PRECISION = 3


def fetch(names):
    query = urllib.parse.urlencode({
        "base_name": ",".join(names),
        "show": "coords,loc,strat",
        "limit": "all",
    })
    request = urllib.request.Request(
        f"{ENDPOINT}?{query}",
        headers={"User-Agent": "dino-studio-prototype (portfolio project)"},
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        return json.loads(response.read().decode("utf-8"))


def main():
    dinosaurs = json.loads((DATA / "dinosaurs.json").read_text())
    names = [d["name"] for d in dinosaurs]

    payload = fetch(names)
    records = payload.get("records", [])
    print(f"PBDB returned {len(records)} occurrences")

    known = {d["name"] for d in dinosaurs}
    by_genus = {}
    for record in records:
        # `tna` is the accepted name, e.g. "Citipati osmolskae" — the genus is
        # the first token. Records under a genus we did not ask about are
        # skipped rather than guessed at.
        genus = str(record.get("tna", "")).split(" ")[0]
        if genus not in known:
            continue
        lng, lat = record.get("lng"), record.get("lat")
        if lng is None or lat is None:
            continue
        point = [round(float(lng), PRECISION), round(float(lat), PRECISION)]
        formation = (record.get("sfm") or "").strip()
        # One dig site can yield many catalogued occurrences; the map wants
        # places, not specimens, so identical coordinates collapse.
        by_genus.setdefault(genus, {})[tuple(point)] = formation or None

    out = {
        genus: [[*point, formation] if formation else [*point]
                for point, formation in sorted(points.items())]
        for genus, points in sorted(by_genus.items())
    }

    missing = sorted(known - set(out))
    target = DATA / "occurrences.json"
    target.write_text(json.dumps(out, separators=(",", ":")))

    total = sum(len(v) for v in out.values())
    size = target.stat().st_size // 1024
    print(f"{len(out)}/{len(known)} genera, {total} distinct sites, {size} KB")
    if missing:
        print(f"no occurrences for: {', '.join(missing)}")


if __name__ == "__main__":
    main()
