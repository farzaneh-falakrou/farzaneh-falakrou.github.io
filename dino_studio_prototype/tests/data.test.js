const assert = require('node:assert/strict');
const { filterDinosaurs } = require('../js/data.js');

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

testFilterByNameCaseInsensitivePartial();
testFilterByCountry();
testFilterByDiet();
testEmptyQueryReturnsAll();
testNoMatchesReturnsEmptyArray();
console.log('filterDinosaurs: all tests passed');
