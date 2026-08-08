function filterDinosaurs(dinosaurs, query) {
  const q = query.trim().toLowerCase();
  if (!q) return dinosaurs.slice();
  return dinosaurs.filter((d) => {
    const haystack = [d.name, d.foundIn, d.diet, d.typeOfDinosaur]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

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

const COUNTRY_POSITIONS = {
  Algeria: { x: 51, y: 34 },
  Antarctica: { x: 50, y: 94 },
  Argentina: { x: 32, y: 69 },
  Australia: { x: 88, y: 64 },
  Canada: { x: 21, y: 19 },
  Chile: { x: 30, y: 68 },
  China: { x: 79, y: 31 },
  Egypt: { x: 58, y: 35 },
  England: { x: 50, y: 21 },
  France: { x: 51, y: 24 },
  Germany: { x: 53, y: 22 },
  India: { x: 72, y: 38 },
  Kazakhstan: { x: 69, y: 23 },
  Mongolia: { x: 79, y: 24 },
  Morocco: { x: 48, y: 32 },
  Niger: { x: 52, y: 41 },
  'North Africa': { x: 54, y: 36 },
  Portugal: { x: 48, y: 28 },
  'South Africa': { x: 57, y: 67 },
  Tanzania: { x: 60, y: 53 },
  USA: { x: 22, y: 28 },
  'United Kingdom': { x: 50, y: 21 },
  Uruguay: { x: 34, y: 68 },
  Uzbekistan: { x: 68, y: 27 },
  Zimbabwe: { x: 58, y: 61 },
};

// Assumes COUNTRY_POSITIONS covers every country in dinosaurs.json (verified
// at build time — see Task 5 of plans/2026-08-08-dino-studio-prototype.md).
// Unknown countries are silently dropped: add new entries here when adding
// dinosaurs whose foundIn introduces a country not already listed above.
function resolveCountryPositions(foundIn) {
  return foundIn
    .split(',')
    .map((c) => c.trim())
    .filter((c) => COUNTRY_POSITIONS[c])
    .map((c) => ({ country: c, ...COUNTRY_POSITIONS[c] }));
}

if (typeof module !== 'undefined') {
  module.exports = {
    filterDinosaurs,
    computeDietCounts,
    computeTypeCounts,
    resolveTaxonomyPath,
    buildTaxonomyTree,
    resolveCountryPositions,
    COUNTRY_POSITIONS,
  };
}
