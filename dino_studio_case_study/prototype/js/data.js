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
    buildTaxonomyTree,
    resolveCountryGeoNames,
    computeCountryCounts,
    COUNTRY_GEO_NAMES,
  };
}
