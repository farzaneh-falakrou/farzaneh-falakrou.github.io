const assert = require('node:assert/strict');
const {
  computeDietCounts, computeTypeCounts,
  resolveTaxonomyPath, buildTaxonomyTree,
  resolveCountryGeoNames, computeCountryCounts,
  parseWhenLived, packLanes, packDots,
  canonicalCountry, countryLabels,
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
testParseWhenLivedRange();
testParseWhenLivedNormalisesReversedPair();
testParseWhenLivedSinglePoint();
testParseWhenLivedRejectsUnparseable();
testParseWhenLivedCoversWholeDataset();
testPackLanesReusesLaneWhenBarsDoNotOverlap();
testPackLanesOpensLaneWhenBarsOverlap();
testPackDotsKeepsClearPointsInOneLane();
testPackDotsOpensLaneForCrowdedPoints();
testPackDotsNeverMovesAPointAlongTheAxis();
testResolveCountryGeoNamesDeduplicatesAliasedLabels();
testCountryCountsDoNotDoubleCountUkRecords();
testCanonicalCountryAliasesEngland();
testCountryLabelsAreDistinctAndCanonical();
console.log('data: all tests passed');

function testParseWhenLivedRange() {
  assert.deepEqual(
    parseWhenLived({ whenLived: 'Early Jurassic, 199-189 million years ago' }),
    { epoch: 'Early Jurassic', from: 199, to: 189, isPoint: false },
  );
}

// Carnotaurus is recorded "69-71" — younger bound first. `from` must still be
// the older edge, or the bar renders with a negative width.
function testParseWhenLivedNormalisesReversedPair() {
  const span = parseWhenLived({ whenLived: 'Late Cretaceous, 69-71 million years ago' });
  assert.equal(span.from, 71);
  assert.equal(span.to, 69);
}

function testParseWhenLivedSinglePoint() {
  const span = parseWhenLived({ whenLived: 'Late Triassic, 228 million years ago' });
  assert.equal(span.from, 228);
  assert.equal(span.to, 228);
  assert.equal(span.isPoint, true, 'a point date is an absence of range, not a zero-length one');
}

function testParseWhenLivedRejectsUnparseable() {
  assert.equal(parseWhenLived({ whenLived: 'sometime in the Jurassic' }), null);
  assert.equal(parseWhenLived({}), null);
}

// The timeline silently drops anything that fails to parse, so the guarantee
// that nothing is dropped belongs in a test.
function testParseWhenLivedCoversWholeDataset() {
  const dinosaurs = require('../data/dinosaurs.json');
  const unparsed = dinosaurs.filter((d) => parseWhenLived(d) === null);
  assert.deepEqual(unparsed.map((d) => d.name), [], 'every whenLived value must parse');
}

function testPackLanesReusesLaneWhenBarsDoNotOverlap() {
  const lanes = packLanes([
    { name: 'older', span: { from: 200, to: 180 } },
    { name: 'younger', span: { from: 150, to: 130 } },
  ]);
  assert.equal(lanes.length, 1);
  assert.deepEqual(lanes[0].map((e) => e.name), ['older', 'younger']);
}

function testPackLanesOpensLaneWhenBarsOverlap() {
  const lanes = packLanes([
    { name: 'a', span: { from: 200, to: 150 } },
    { name: 'b', span: { from: 180, to: 120 } },
  ]);
  assert.equal(lanes.length, 2);
}

function testPackDotsKeepsClearPointsInOneLane() {
  const lanes = packDots([{ position: 0 }, { position: 10 }, { position: 20 }], 5);
  assert.equal(lanes.length, 1);
}

function testPackDotsOpensLaneForCrowdedPoints() {
  const lanes = packDots([{ position: 0 }, { position: 1 }, { position: 2 }], 5);
  assert.equal(lanes.length, 3);
}

// The whole point of a beeswarm over jitter: the encoded axis stays truthful.
function testPackDotsNeverMovesAPointAlongTheAxis() {
  const input = [{ position: 3 }, { position: 1 }, { position: 1.2 }, { position: 9 }];
  const lanes = packDots(input, 2);
  const out = lanes.flat().map((e) => e.position).sort((a, b) => a - b);
  assert.deepEqual(out, [1, 1.2, 3, 9]);
}

// Every UK record lists both "England" and "United Kingdom"; both resolve to the
// same polygon, so without de-duplication the choropleth counted each twice.
function testResolveCountryGeoNamesDeduplicatesAliasedLabels() {
  assert.deepEqual(resolveCountryGeoNames('England, United Kingdom'), ['United Kingdom']);
  assert.deepEqual(
    resolveCountryGeoNames('England, France, Portugal, United Kingdom'),
    ['United Kingdom', 'France', 'Portugal'],
  );
}

function testCountryCountsDoNotDoubleCountUkRecords() {
  const dinosaurs = require('../data/dinosaurs.json');
  const ukRecords = dinosaurs.filter((d) => /United Kingdom|England/.test(d.foundIn)).length;
  assert.equal(computeCountryCounts(dinosaurs)['United Kingdom'], ukRecords);
}

function testCanonicalCountryAliasesEngland() {
  assert.equal(canonicalCountry('England'), 'United Kingdom');
  assert.equal(canonicalCountry(' France '), 'France');
  assert.equal(canonicalCountry('North Africa'), 'North Africa', 'regions are kept, not dropped');
}

function testCountryLabelsAreDistinctAndCanonical() {
  assert.deepEqual(countryLabels('England, United Kingdom, USA'), ['United Kingdom', 'USA']);
}
