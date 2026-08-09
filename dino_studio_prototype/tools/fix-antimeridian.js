#!/usr/bin/env node
/**
 * Fixes antimeridian-crossing polygons in a GeoJSON FeatureCollection.
 *
 * Natural Earth stores countries that straddle ±180° (Fiji, Russia, Antarctica)
 * as single rings whose longitudes jump from +179 to -180. Renderers that treat
 * coordinates as plain 2D points draw that jump as a line straight back across
 * the whole map — which is where the stray horizontal bar over the Pacific came
 * from.
 *
 * The fix: unwrap each ring's longitudes into a continuous sequence, then clip
 * it to each 360°-wide world band it touches and shift the result back into
 * [-180, 180]. Rings that never cross are passed through untouched.
 *
 * Usage: node tools/fix-antimeridian.js <input.geo.json> <output.geo.json>
 */

'use strict';
const fs = require('fs');

// Rewrites a ring so consecutive longitudes never jump more than 180°,
// letting values run outside [-180, 180] to stay continuous.
function unwrapRing(ring) {
  const out = [ring[0].slice()];
  let offset = 0;
  let wrapped = false;
  for (let i = 1; i < ring.length; i++) {
    const prevRaw = ring[i - 1][0];
    const curRaw = ring[i][0];
    const delta = curRaw - prevRaw;
    if (delta > 180) { offset -= 360; wrapped = true; }
    else if (delta < -180) { offset += 360; wrapped = true; }
    out.push([curRaw + offset, ring[i][1]]);
  }
  return { ring: out, wrapped };
}

// Sutherland–Hodgman clip of a ring against a vertical half-plane.
// keepLeft=true keeps x <= bound; otherwise keeps x >= bound.
function clipToHalfPlane(ring, bound, keepLeft) {
  const inside = (p) => (keepLeft ? p[0] <= bound : p[0] >= bound);
  const intersect = (a, b) => {
    const t = (bound - a[0]) / (b[0] - a[0]);
    return [bound, a[1] + t * (b[1] - a[1])];
  };

  const out = [];
  for (let i = 0; i < ring.length; i++) {
    const cur = ring[i];
    const prev = ring[(i + ring.length - 1) % ring.length];
    const curIn = inside(cur);
    const prevIn = inside(prev);
    if (curIn) {
      if (!prevIn) out.push(intersect(prev, cur));
      out.push(cur);
    } else if (prevIn) {
      out.push(intersect(prev, cur));
    }
  }
  return out;
}

function closeRing(ring) {
  if (ring.length === 0) return ring;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first.slice());
  return ring;
}

// Closes a ring that circles a pole (Antarctica): its unwrapped ends sit a
// full 360° apart at the same latitude, so joining them directly would draw a
// bar straight across the map. Instead route the closure through the pole so
// the landmass fills down to the edge, which is how polar polygons are meant
// to be rendered.
function closeUnwrappedRing(ring) {
  const first = ring[0];
  const last = ring[ring.length - 1];
  const spansWorld = Math.abs(Math.abs(last[0] - first[0]) - 360) < 1e-6;
  const sameLat = Math.abs(last[1] - first[1]) < 1e-6;

  if (spansWorld && sameLat) {
    const poleLat = first[1] < 0 ? -90 : 90;
    ring.push([last[0], poleLat]);
    ring.push([first[0], poleLat]);
    ring.push(first.slice());
    return ring;
  }
  return closeRing(ring);
}

// Splits one ring into >= 1 rings, each wholly inside [-180, 180].
function splitRing(ring) {
  const { ring: unwrapped, wrapped } = unwrapRing(ring);

  // Never crossed the antimeridian — leave it byte-for-byte as it was.
  if (!wrapped) return [ring];

  const lngs = unwrapped.map((p) => p[0]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Crossed, but the unwrapped path already fits one world: the unwrapped
  // ring is the corrected, continuous version — return that, not the
  // original (which still contains the ±180 jump).
  if (minLng >= -180 && maxLng <= 180) return [closeUnwrappedRing(unwrapped)];

  const firstBand = Math.floor((minLng + 180) / 360);
  const lastBand = Math.floor((maxLng + 180) / 360);

  const pieces = [];
  for (let band = firstBand; band <= lastBand; band++) {
    const lo = -180 + band * 360;
    const hi = 180 + band * 360;
    let clipped = clipToHalfPlane(unwrapped, lo, false);
    if (clipped.length === 0) continue;
    clipped = clipToHalfPlane(clipped, hi, true);
    if (clipped.length < 3) continue;

    // Shift the band back onto the canonical [-180, 180] world.
    const shifted = clipped.map(([x, y]) => {
      let lng = x - band * 360;
      if (lng > 180) lng = 180;
      if (lng < -180) lng = -180;
      return [lng, y];
    });
    pieces.push(closeRing(shifted));
  }

  return pieces.length > 0 ? pieces : [ring];
}

// A polygon is [outerRing, ...holes]. Splitting can turn one polygon into
// several; holes are split alongside and re-attached to whichever piece
// contains them, approximated here by longitude overlap (sufficient for
// country data, where holes never span the antimeridian themselves).
function splitPolygon(polygon) {
  const [outer, ...holes] = polygon;
  const outerPieces = splitRing(outer);

  // One piece and no holes: still return the piece rather than the original
  // polygon — splitRing may have corrected the ring in place (the polar case).
  if (outerPieces.length === 1 && holes.length === 0) return [[outerPieces[0]]];

  return outerPieces.map((piece) => {
    const lngs = piece.map((p) => p[0]);
    const min = Math.min(...lngs);
    const max = Math.max(...lngs);
    const owned = holes.filter((h) => {
      const hx = h.map((p) => p[0]);
      const hMid = (Math.min(...hx) + Math.max(...hx)) / 2;
      return hMid >= min && hMid <= max;
    });
    return [piece, ...owned];
  });
}

function fixGeometry(geometry) {
  if (geometry.type === 'Polygon') {
    const polys = splitPolygon(geometry.coordinates);
    if (polys.length === 1) return { type: 'Polygon', coordinates: polys[0] };
    return { type: 'MultiPolygon', coordinates: polys };
  }
  if (geometry.type === 'MultiPolygon') {
    const polys = geometry.coordinates.flatMap(splitPolygon);
    return { type: 'MultiPolygon', coordinates: polys };
  }
  return geometry;
}

function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error('Usage: node tools/fix-antimeridian.js <input.geo.json> <output.geo.json>');
    process.exit(1);
  }

  const geo = JSON.parse(fs.readFileSync(input, 'utf8'));
  geo.features = geo.features.map((f) => ({ ...f, geometry: fixGeometry(f.geometry) }));
  fs.writeFileSync(output, JSON.stringify(geo));

  // Report anything still crossing, so a silent failure can't slip through.
  // Segments that run along a pole (|lat| >= 89.9) are the intentional polar
  // closures added above: Web Mercator clamps near ±85°, so they are never
  // drawn and cannot produce a visible bar.
  const remaining = [];
  for (const f of geo.features) {
    const g = f.geometry;
    const rings = g.type === 'Polygon' ? g.coordinates
      : g.type === 'MultiPolygon' ? g.coordinates.flat() : [];
    for (const ring of rings) {
      for (let i = 1; i < ring.length; i++) {
        const a = ring[i - 1];
        const b = ring[i];
        const atPole = Math.abs(a[1]) >= 89.9 && Math.abs(b[1]) >= 89.9;
        if (!atPole && Math.abs(b[0] - a[0]) > 180) {
          remaining.push(f.properties.name);
          break;
        }
      }
    }
  }
  console.log(`wrote ${output}`);
  console.log('features still crossing the antimeridian:', [...new Set(remaining)]);
}

main();
