const assert = require('node:assert/strict');
const {
  computeDietCounts, computeTypeCounts,
  resolveTaxonomyPath, buildTaxonomyTree,
  resolveCountryGeoNames, computeCountryCounts,
} = require('../js/data.js');

const sample = [
  { name: 'Aardonyx', foundIn: 'South Africa', diet: 'herbivorous', typeOfDinosaur: 'prosauropod' },
  { name: 'Tyrannosaurus', foundIn: 'USA, Canada', diet: 'carnivorous', typeOfDinosaur: 'large theropod' },
  { name: 'Triceratops', foundIn: 'USA', diet: 'herbivorous', typeOfDinosaur: 'ceratopsian' },
];

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

testComputeDietCounts();
testComputeTypeCounts();
testResolveTaxonomyPathAppendsName();
testResolveTaxonomyPathTrimsWhitespace();
testBuildTaxonomyTreeSharesCommonAncestors();
testResolveCountryGeoNamesSingleCountry();
testResolveCountryGeoNamesMultiCountry();
testResolveCountryGeoNamesUnmappedSkipped();
testComputeCountryCountsTalliesMultiCountryEntries();
console.log('data: all tests passed');
