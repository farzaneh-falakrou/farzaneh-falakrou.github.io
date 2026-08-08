const assert = require('node:assert/strict');
const { filterDinosaurs, computeDietCounts, computeTypeCounts } = require('../js/data.js');

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

testFilterByNameCaseInsensitivePartial();
testFilterByCountry();
testFilterByDiet();
testEmptyQueryReturnsAll();
testNoMatchesReturnsEmptyArray();
testComputeDietCounts();
testComputeTypeCounts();
console.log('filterDinosaurs: all tests passed');
