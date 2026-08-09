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
import re
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
ENDPOINT = "https://paleobiodb.org/data1.2/occs/list.json"
# 3 decimal places is ~110 m at the equator — far finer than a dig site needs,
# and it roughly halves the payload against full precision.
PRECISION = 3


# --- Cross-check against the museum's own foundIn field ---------------------
#
# base_name=Genus returns every species PBDB currently files under that genus
# concept, which is not always what the NHM record means by "this animal": a
# different species in the same genus, a historically contested Central Asian
# identification, or a genus PBDB has since split. Checked directly: of 1063
# geolocatable sites, 115 (~11%) landed in a country the record's own foundIn
# does not list — e.g. Albertosaurus (foundIn: Canada) returning sites in the
# US and Mexico, Alectrosaurus (foundIn: China, Mongolia) returning sites in
# Uzbekistan and Tajikistan. Rather than show a dinosaur's dig sites
# disagreeing with the dataset's own claim of where it was found, sites
# outside the record's countries are dropped.


def point_in_ring(pt, ring):
    x, y = pt
    inside = False
    j = len(ring) - 1
    for i, (xi, yi) in enumerate(ring):
        xj, yj = ring[j]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi + 1e-15) + xi:
            inside = not inside
        j = i
    return inside


def point_in_geometry(pt, geometry):
    kind = geometry["type"]
    if kind == "Polygon":
        rings = geometry["coordinates"]
        if not point_in_ring(pt, rings[0]):
            return False
        return not any(point_in_ring(pt, hole) for hole in rings[1:])
    if kind == "MultiPolygon":
        return any(
            point_in_geometry(pt, {"type": "Polygon", "coordinates": polygon})
            for polygon in geometry["coordinates"]
        )
    return False


def load_country_geo_names():
    # The same alias table js/data.js uses to resolve a foundIn string to a
    # choropleth polygon name — read from source so the two never drift apart.
    source = (ROOT / "js" / "data.js").read_text()
    match = re.search(r"const COUNTRY_GEO_NAMES = \{(.*?)\n\};", source, re.S)
    table = {}
    for key, whole, inner in re.findall(r"[\"']?([\w .'-]+)[\"']?\s*:\s*(null|'([^']*)')", match.group(1)):
        table[key.strip()] = None if whole == "null" else inner
    return table


def build_country_lookup():
    world = json.loads((DATA / "world-countries.geo.json").read_text())
    features = world["features"]

    def country_for(lng, lat):
        for feature in features:
            if point_in_geometry((lng, lat), feature["geometry"]):
                return feature["properties"]["name"]
        return None

    return country_for


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

    geo_names = load_country_geo_names()
    country_for = build_country_lookup()
    expected_countries = {
        d["name"]: {
            geo_names.get(c.strip())
            for c in d["foundIn"].split(",")
        } - {None}
        for d in dinosaurs
    }

    known = {d["name"] for d in dinosaurs}
    by_genus = {}
    dropped = 0
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
        lng, lat = float(lng), float(lat)

        expected = expected_countries.get(genus, set())
        if expected:
            resolved = country_for(lng, lat)
            # A point outside every polygon (open ocean, a coastline rounding
            # error) is kept rather than dropped — there's no country to
            # disagree with the record.
            if resolved is not None and resolved not in expected:
                dropped += 1
                continue

        point = [round(lng, PRECISION), round(lat, PRECISION)]
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
    print(f"{dropped} occurrences dropped for disagreeing with the record's own foundIn")
    if missing:
        print(f"no occurrences for: {', '.join(missing)}")


if __name__ == "__main__":
    main()
