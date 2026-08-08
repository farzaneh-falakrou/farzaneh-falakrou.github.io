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

if (typeof module !== 'undefined') {
  module.exports = { filterDinosaurs, computeDietCounts, computeTypeCounts };
}
