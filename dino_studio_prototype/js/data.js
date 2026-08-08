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

if (typeof module !== 'undefined') {
  module.exports = { filterDinosaurs };
}
