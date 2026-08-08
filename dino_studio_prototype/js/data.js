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

if (typeof module !== 'undefined') {
  module.exports = {
    filterDinosaurs,
    computeDietCounts,
    computeTypeCounts,
    resolveTaxonomyPath,
    buildTaxonomyTree,
  };
}
