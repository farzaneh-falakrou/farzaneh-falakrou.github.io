function computeDietCounts(dinosaurs) {
  const counts = { herbivorous: 0, carnivorous: 0, omnivorous: 0 };
  for (const d of dinosaurs) {
    if (d.diet in counts) counts[d.diet] += 1;
  }
  return counts;
}

function computeTypeCounts(dinosaurs) {
  const counts = {};
  for (const d of dinosaurs) {
    counts[d.typeOfDinosaur] = (counts[d.typeOfDinosaur] || 0) + 1;
  }
  return counts;
}

// --- Deep time -----------------------------------------------------------
//
// `whenLived` is free text but rigidly shaped: "<Epoch>, A-B million years
// ago", or a single point "<Epoch>, A million years ago" for 8 of the 75.
// All 75 records parse. This is the dataset's one fully-populated continuous
// dimension besides length, and nothing in the UI used it.

// Epoch boundaries in millions of years ago, International Chronostratigraphic
// Chart v2023/09. These are OUR constants, not data from the dataset — the UI
// says so, so the bands don't read as invented precision.
const EPOCH_BOUNDS = [
  { name: 'Late Triassic', from: 237, to: 201.4 },
  { name: 'Early Jurassic', from: 201.4, to: 174.7 },
  { name: 'Mid Jurassic', from: 174.7, to: 161.5 },
  { name: 'Late Jurassic', from: 161.5, to: 143.1 },
  { name: 'Early Cretaceous', from: 143.1, to: 100.5 },
  { name: 'Late Cretaceous', from: 100.5, to: 66 },
];

const WHEN_LIVED = /^(.*?),\s*([\d.]+)(?:\s*-\s*([\d.]+))?\s*million years ago\s*$/;

// `from` is always the older (larger) bound. Carnotaurus is recorded "69-71",
// i.e. reversed, so the pair is normalised rather than trusted in order.
function parseWhenLived(dinosaur) {
  const match = WHEN_LIVED.exec(String(dinosaur.whenLived || ''));
  if (!match) return null;
  const a = Number(match[2]);
  const b = match[3] === undefined ? a : Number(match[3]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return {
    epoch: match[1].trim(),
    from: Math.max(a, b),
    to: Math.min(a, b),
    // A single-point date is not a 0-length range; it is an absence of range,
    // and must not be drawn as a bar whose width implies a duration.
    isPoint: match[3] === undefined,
  };
}

// Beeswarm packing for a 1-D strip plot: walk in ascending order and drop each
// point into the first lane where it clears the previous point by `minGap`
// (in the same units as `position`). Keeps every point at its true position —
// unlike jitter, which would displace points along the encoded axis.
function packDots(entries, minGap) {
  const sorted = [...entries].sort((a, b) => a.position - b.position);
  const lanes = [];
  const lastIn = [];
  for (const entry of sorted) {
    let placed = false;
    for (let i = 0; i < lanes.length; i += 1) {
      if (entry.position - lastIn[i] >= minGap) {
        lanes[i].push(entry);
        lastIn[i] = entry.position;
        placed = true;
        break;
      }
    }
    if (!placed) {
      lanes.push([entry]);
      lastIn.push(entry.position);
    }
  }
  return lanes;
}

// Greedy lane packing: walk oldest-first and drop each bar into the first lane
// whose last bar has already ended. Produces a compact Gantt-style layout.
function packLanes(entries, minGap = 0) {
  const sorted = [...entries].sort((x, y) => y.span.from - x.span.from);
  const lanes = [];
  for (const entry of sorted) {
    let placed = false;
    for (let i = 0; i < lanes.length; i += 1) {
      const last = lanes[i][lanes[i].length - 1];
      if (last.span.to > entry.span.from + minGap) {
        lanes[i].push(entry);
        placed = true;
        break;
      }
    }
    if (!placed) lanes.push([entry]);
  }
  return lanes;
}

function resolveTaxonomyPath(dinosaur) {
  const segments = dinosaur.taxonomy
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  segments.push(dinosaur.name);
  return segments;
}

function buildTaxonomyTree(dinosaurs) {
  const root = { name: 'root', children: {}, isLeaf: false };
  for (const dinosaur of dinosaurs) {
    const path = resolveTaxonomyPath(dinosaur);
    let node = root;
    path.forEach((segment, i) => {
      if (!node.children[segment]) {
        node.children[segment] = { name: segment, children: {}, isLeaf: false };
      }
      node = node.children[segment];
      if (i === path.length - 1) node.isLeaf = true;
    });
  }
  return root;
}

// Maps a country string as it appears in dinosaurs.json's `foundIn` field to
// the matching `properties.name` in data/world-countries.geo.json (Natural
// Earth 110m country polygons, via the world-atlas npm package), for
// rendering an actual choropleth map. `null` means no matching polygon
// exists in that dataset (e.g. "North Africa" is a region, not a country) —
// those are excluded from the choropleth rather than mapped incorrectly.
const COUNTRY_GEO_NAMES = {
  Algeria: 'Algeria',
  Antarctica: 'Antarctica',
  Argentina: 'Argentina',
  Australia: 'Australia',
  Canada: 'Canada',
  Chile: 'Chile',
  China: 'China',
  Egypt: 'Egypt',
  England: 'United Kingdom',
  France: 'France',
  Germany: 'Germany',
  India: 'India',
  Kazakhstan: 'Kazakhstan',
  Mongolia: 'Mongolia',
  Morocco: 'Morocco',
  Niger: 'Niger',
  'North Africa': null,
  Portugal: 'Portugal',
  'South Africa': 'South Africa',
  Tanzania: 'Tanzania',
  USA: 'United States of America',
  'United Kingdom': 'United Kingdom',
  Uruguay: 'Uruguay',
  Uzbekistan: 'Uzbekistan',
  Zimbabwe: 'Zimbabwe',
};

// Assumes COUNTRY_GEO_NAMES covers every country in dinosaurs.json (verified
// at build time). Unknown/unmapped countries are silently dropped: add new
// entries here when adding dinosaurs whose foundIn introduces a country not
// already listed above.
function resolveCountryGeoNames(foundIn) {
  return foundIn
    .split(',')
    .map((c) => c.trim())
    .map((c) => COUNTRY_GEO_NAMES[c])
    .filter(Boolean);
}

// Tallies how many dinosaurs were found in each choropleth country (by geo
// name), for coloring the map by density. A dinosaur found in multiple
// countries (e.g. "Canada, USA") counts once toward each.
function computeCountryCounts(dinosaurs) {
  const counts = {};
  for (const dinosaur of dinosaurs) {
    for (const geoName of resolveCountryGeoNames(dinosaur.foundIn)) {
      counts[geoName] = (counts[geoName] || 0) + 1;
    }
  }
  return counts;
}

if (typeof module !== 'undefined') {
  module.exports = {
    computeDietCounts,
    computeTypeCounts,
    resolveTaxonomyPath,
    parseWhenLived,
    packLanes,
    packDots,
    EPOCH_BOUNDS,
    buildTaxonomyTree,
    resolveCountryGeoNames,
    computeCountryCounts,
    COUNTRY_GEO_NAMES,
  };
}
