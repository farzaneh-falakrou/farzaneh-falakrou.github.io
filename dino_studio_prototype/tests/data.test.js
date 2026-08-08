const assert = require('node:assert/strict');
const {
  filterDinosaurs, computeDietCounts, computeTypeCounts,
  resolveTaxonomyPath, buildTaxonomyTree,
  resolveCountryGeoNames, computeCountryCounts,
} = require('../js/data.js');

const sample = [
  { name: 'Aardonyx', foundIn: 'South Africa', diet: 'herbivorous', typeOfDinosaur: 'prosauropod' },
  { name: 'Tyrannosaurus', foundIn: 'USA, Canada', diet: 'carnivorous', typeOfDinosaur: 'large theropod' },
  { name: 'Triceratops', foundIn: 'USA', diet: 'herbivorous', typeOfDinosaur: 'ceratopsian' },
];

function testFilterByNameCaseInsensitivePartial() {
  const result = filterDinosaurs(sample, 'tri');
  assert.deepEqual(result.map(d => d.name), ['Triceratops']);
}

function testFilterByCountry() {
  const result = filterDinosaurs(sample, 'usa');
  assert.deepEqual(result.map(d => d.name).sort(), ['Triceratops', 'Tyrannosaurus']);
}

function testFilterByDiet() {
  const result = filterDinosaurs(sample, 'carnivorous');
  assert.deepEqual(result.map(d => d.name), ['Tyrannosaurus']);
}

function testEmptyQueryReturnsAll() {
  const result = filterDinosaurs(sample, '');
  assert.equal(result.length, 3);
}

function testNoMatchesReturnsEmptyArray() {
  const result = filterDinosaurs(sample, 'xyz-no-match');
  assert.deepEqual(result, []);
}

function testComputeDietCounts() {
  const result = computeDietCounts(sample);
  assert.deepEqual(result, { herbivorous: 2, carnivorous: 1, omnivorous: 0 });
}

function testComputeTypeCounts() {
  const result = computeTypeCounts(sample);
  assert.deepEqual(result, {
    prosauropod: 1,
    'large theropod': 1,
    ceratopsian: 1,
  });
}

const taxonomySample = [
  { name: 'Aardonyx', taxonomy: 'Dinosauria, Saurischia, Sauropodomorpha, Prosauropoda, Anchisauria' },
  { name: 'Massospondylus', taxonomy: 'Dinosauria, Saurischia, Sauropodomorpha, Prosauropoda' },
  { name: 'Tyrannosaurus', taxonomy: 'Dinosauria, Saurischia, Theropoda, Tyrannosauroidea' },
];

function testResolveTaxonomyPathAppendsName() {
  const path = resolveTaxonomyPath(taxonomySample[0]);
  assert.deepEqual(path, [
    'Dinosauria', 'Saurischia', 'Sauropodomorpha', 'Prosauropoda', 'Anchisauria', 'Aardonyx',
  ]);
}

function testResolveTaxonomyPathTrimsWhitespace() {
  const path = resolveTaxonomyPath({ name: 'X', taxonomy: 'A,  B ,C' });
  assert.deepEqual(path, ['A', 'B', 'C', 'X']);
}

function testBuildTaxonomyTreeSharesCommonAncestors() {
  const tree = buildTaxonomyTree(taxonomySample);
  // root -> Dinosauria -> Saurischia -> Sauropodomorpha -> Prosauropoda -> { Anchisauria -> Aardonyx (leaf) }
  //                                                                      -> Massospondylus (leaf)
  const dinosauria = tree.children['Dinosauria'];
  const saurischia = dinosauria.children['Saurischia'];
  assert.equal(Object.keys(saurischia.children).sort().join(','), 'Sauropodomorpha,Theropoda');

  const prosauropoda = saurischia.children['Sauropodomorpha'].children['Prosauropoda'];
  assert.ok(prosauropoda.children['Massospondylus'].isLeaf);
  assert.ok(prosauropoda.children['Anchisauria'].children['Aardonyx'].isLeaf);
}

function testResolveCountryGeoNamesSingleCountry() {
  const geoNames = resolveCountryGeoNames('USA');
  assert.deepEqual(geoNames, ['United States of America']);
}

function testResolveCountryGeoNamesMultiCountry() {
  const geoNames = resolveCountryGeoNames('Canada, USA');
  assert.deepEqual(geoNames, ['Canada', 'United States of America']);
}

function testResolveCountryGeoNamesUnmappedSkipped() {
  const geoNames = resolveCountryGeoNames('Atlantis, North Africa');
  assert.deepEqual(geoNames, []);
}

function testComputeCountryCountsTalliesMultiCountryEntries() {
  const counts = computeCountryCounts(sample);
  // Aardonyx -> South Africa; Tyrannosaurus -> USA, Canada; Triceratops -> USA
  assert.deepEqual(counts, {
    'South Africa': 1,
    'United States of America': 2,
    Canada: 1,
  });
}

testFilterByNameCaseInsensitivePartial();
testFilterByCountry();
testFilterByDiet();
testEmptyQueryReturnsAll();
testNoMatchesReturnsEmptyArray();
testComputeDietCounts();
testComputeTypeCounts();
testResolveTaxonomyPathAppendsName();
testResolveTaxonomyPathTrimsWhitespace();
testBuildTaxonomyTreeSharesCommonAncestors();
testResolveCountryGeoNamesSingleCountry();
testResolveCountryGeoNamesMultiCountry();
testResolveCountryGeoNamesUnmappedSkipped();
testComputeCountryCountsTalliesMultiCountryEntries();
console.log('filterDinosaurs: all tests passed');
