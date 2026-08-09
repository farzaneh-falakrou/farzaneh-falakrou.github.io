const assert = require('node:assert/strict');
const {
  normalizeText, editDistance, searchDinosaurs, suggestCompletions, suggestCorrection,
} = require('../js/search.js');

// Run against the real dataset — the point of this search is to behave well on
// the actual 75 dinosaurs, not on a toy fixture.
const dinosaurs = require('../data/dinosaurs.json');
const names = (list) => list.map((d) => d.name);

function testNormalizeStripsAccentsAndCase() {
  assert.equal(normalizeText('Osmólska'), 'osmolska');
  assert.equal(normalizeText('  TyrannoSAURUS  '), 'tyrannosaurus');
  assert.equal(normalizeText(null), '');
}

function testEditDistanceBasics() {
  assert.equal(editDistance('kitten', 'sitting', 5), 3);
  assert.equal(editDistance('abc', 'abc', 2), 0);
  // adjacent transposition counts as one edit, not two
  assert.equal(editDistance('ab', 'ba', 2), 1);
  // early bail-out returns max+1 rather than the true distance
  assert.ok(editDistance('abcdefgh', 'zzzzzzzz', 2) > 2);
}

function testEmptyQueryReturnsEverything() {
  assert.equal(searchDinosaurs(dinosaurs, '').length, dinosaurs.length);
  assert.equal(searchDinosaurs(dinosaurs, '   ').length, dinosaurs.length);
}

function testExactNameRanksFirst() {
  assert.equal(searchDinosaurs(dinosaurs, 'Allosaurus')[0].name, 'Allosaurus');
  assert.equal(searchDinosaurs(dinosaurs, 'diplodocus')[0].name, 'Diplodocus');
}

function testPrefixRanksAboveSubstring() {
  const result = names(searchDinosaurs(dinosaurs, 'allo'));
  assert.equal(result[0], 'Allosaurus');
}

function testTypoIsForgiven() {
  // single substitution
  assert.equal(searchDinosaurs(dinosaurs, 'allosaurns')[0].name, 'Allosaurus');
  // transposition
  assert.equal(searchDinosaurs(dinosaurs, 'diplodocsu')[0].name, 'Diplodocus');
  // missing letter
  assert.equal(searchDinosaurs(dinosaurs, 'brachiosaurs')[0].name, 'Brachiosaurus');
}

function testSearchByCountryDietAndType() {
  // "usa" also occurs inside names like Datousaurus, so the guarantee is about
  // ranking: every genuine USA dinosaur must come before those coincidences.
  const usa = searchDinosaurs(dinosaurs, 'USA');
  const realUsaCount = dinosaurs.filter((d) => d.foundIn.includes('USA')).length;
  assert.ok(realUsaCount > 0);
  assert.ok(usa.slice(0, realUsaCount).every((d) => d.foundIn.includes('USA')),
    'country matches should outrank incidental mid-name substrings');

  const carnivores = searchDinosaurs(dinosaurs, 'carnivorous');
  const realCarnivores = dinosaurs.filter((d) => d.diet === 'carnivorous').length;
  assert.ok(carnivores.slice(0, realCarnivores).every((d) => d.diet === 'carnivorous'));

  const sauropods = searchDinosaurs(dinosaurs, 'sauropod');
  assert.equal(sauropods[0].typeOfDinosaur.includes('sauropod'), true);
}

function testMultiWordQueryIsAnded() {
  // AND means every term matches *somewhere* on the record, not that each term
  // matches one particular field.
  const matchesTerm = (d, term) =>
    [d.name, d.foundIn, d.diet, d.typeOfDinosaur, d.description]
      .some((v) => normalizeText(v).includes(term));

  const result = searchDinosaurs(dinosaurs, 'sauropod usa');
  assert.ok(result.length > 0, 'expected at least one sauropod from the USA');
  assert.ok(result.every((d) => matchesTerm(d, 'sauropod') && matchesTerm(d, 'usa')),
    'every result must match all query terms');

  // The genuine intersection should lead the ranking.
  assert.ok(result[0].typeOfDinosaur.includes('sauropod'));
  assert.ok(result[0].foundIn.includes('USA'));

  // A term that matches nothing eliminates the whole result set.
  assert.deepEqual(searchDinosaurs(dinosaurs, 'sauropod zzzzqqq'), []);
}

function testGibberishReturnsNothing() {
  assert.deepEqual(searchDinosaurs(dinosaurs, 'zzzzqqqxyw'), []);
}

function testSuggestionsPreferNamesAndAreLimited() {
  const suggestions = suggestCompletions(dinosaurs, 'allo', 5);
  assert.ok(suggestions.length > 0 && suggestions.length <= 5);
  assert.equal(suggestions[0].value, 'Allosaurus');
  assert.equal(suggestions[0].kind, 'name');
  assert.deepEqual(suggestCompletions(dinosaurs, ''), []);
}

function testSuggestionsSurfaceFacets() {
  const countries = suggestCompletions(dinosaurs, 'mongo', 8);
  assert.ok(countries.some((s) => s.value === 'Mongolia' && s.kind === 'country'));

  const diets = suggestCompletions(dinosaurs, 'herbi', 8);
  assert.ok(diets.some((s) => s.value === 'herbivorous' && s.kind === 'diet'));

  // Every suggestion is unique per kind+value.
  const all = suggestCompletions(dinosaurs, 'a', 20);
  const keys = all.map((s) => `${s.kind}:${s.value}`);
  assert.equal(new Set(keys).size, keys.length);
}

function testCorrectionForMisspelling() {
  // NB: this dataset only covers dinosaurs A–G, so corrections are checked
  // against names it actually contains.
  assert.equal(suggestCorrection(dinosaurs, 'ankilosaurus'), 'Ankylosaurus');
  assert.equal(suggestCorrection(dinosaurs, 'diplodokus'), 'Diplodocus');
  assert.equal(suggestCorrection(dinosaurs, 'allosarus'), 'Allosaurus');
  // Nothing close enough, and queries too short to guess from.
  assert.equal(suggestCorrection(dinosaurs, 'zzzzqqqxyw'), null);
  assert.equal(suggestCorrection(dinosaurs, 'ab'), null);
}

function testConfidentMatchesSuppressFuzzyNoise() {
  // A full, correctly spelled name should return that dinosaur — not a spread
  // of near-spellings like Alamosaurus/Ammosaurus.
  const exact = searchDinosaurs(dinosaurs, 'Allosaurus');
  assert.equal(exact[0].name, 'Allosaurus');
  assert.equal(exact.length, 1);

  // But when nothing matches confidently, the fuzzy net still catches typos.
  const typo = searchDinosaurs(dinosaurs, 'allosaurns');
  assert.equal(typo[0].name, 'Allosaurus');

  // "usa" as a country outranks and excludes mid-name coincidences.
  const usa = searchDinosaurs(dinosaurs, 'USA');
  assert.ok(usa.every((d) => d.foundIn.includes('USA')),
    'confident country matches should exclude Datousaurus-style substrings');
}

function testShortQueriesDoNotFuzzyMatchEverything() {
  // At 3 characters we require a real substring hit, otherwise "rex" style
  // queries would drag in half the dataset via edit distance.
  const result = searchDinosaurs(dinosaurs, 'rex');
  assert.ok(result.length < dinosaurs.length);
}

testNormalizeStripsAccentsAndCase();
testEditDistanceBasics();
testEmptyQueryReturnsEverything();
testExactNameRanksFirst();
testPrefixRanksAboveSubstring();
testTypoIsForgiven();
testSearchByCountryDietAndType();
testMultiWordQueryIsAnded();
testGibberishReturnsNothing();
testSuggestionsPreferNamesAndAreLimited();
testSuggestionsSurfaceFacets();
testCorrectionForMisspelling();
testConfidentMatchesSuppressFuzzyNoise();
testShortQueriesDoNotFuzzyMatchEverything();
console.log('search: all tests passed');
