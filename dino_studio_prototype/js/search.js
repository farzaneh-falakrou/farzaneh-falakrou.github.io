/**
 * Search and ranking for the dinosaur dataset.
 *
 * Kept separate from data.js (pure dataset transforms) because this file owns
 * a different concern: turning messy human input into a ranked result list.
 * Loaded as a plain <script> in the browser and require()-able in Node, same
 * dual-export pattern as data.js — no build step.
 */

// Field weights. Name matches dominate; description matches are a last resort
// so a query like "teeth" still finds something rather than dead-ending.
const FIELD_WEIGHTS = {
  name: 1,
  foundIn: 0.55,
  diet: 0.5,
  typeOfDinosaur: 0.5,
  description: 0.18,
};

// Match-quality tiers, multiplied by the field weight above.
// `midWord` is deliberately weak: "usa" occurs inside "Datousaurus", and that
// coincidence must never outrank an actual match on the country USA.
const TIER = {
  exact: 1000,
  prefix: 700,
  wordPrefix: 600,
  midWord: 180,
  fuzzy: 260,
};

function normalizeText(value) {
  return String(value == null ? '' : value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents: "Osmólska" matches "osmolska"
    .toLowerCase()
    .trim();
}

// How many typos to forgive, scaled to query length. Short queries get no
// slack — at 3 characters almost anything is within one edit of everything.
function typoBudget(query) {
  if (query.length <= 3) return 0;
  if (query.length <= 5) return 1;
  return 2;
}

/**
 * Optimal string alignment distance (Damerau-Levenshtein restricted to
 * adjacent transpositions), so "trixeratops" and "tricreatops" both resolve to
 * "triceratops". Bails out early once every cell in a row exceeds `max`,
 * which keeps this cheap enough to run across the whole dataset per keystroke.
 */
function editDistance(a, b, max) {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev2 = [];
  let prev = [];
  let cur = [];
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let value = Math.min(
        prev[j] + 1,        // deletion
        cur[j - 1] + 1,     // insertion
        prev[j - 1] + cost, // substitution
      );
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, prev2[j - 2] + 1); // transposition
      }
      cur[j] = value;
      if (value < rowMin) rowMin = value;
    }
    if (rowMin > max) return max + 1;
    prev2 = prev;
    prev = cur;
  }
  return prev[b.length];
}

// Scores one field value against the query, returning the best tier matched.
function scoreField(value, query, budget) {
  const text = normalizeText(value);
  if (!text) return 0;

  if (text === query) return TIER.exact;
  if (text.startsWith(query)) return TIER.prefix;

  const words = text.split(/[\s,()-]+/).filter(Boolean);
  if (words.some((w) => w.startsWith(query))) return TIER.wordPrefix;
  if (text.includes(query)) return TIER.midWord;

  if (budget > 0) {
    // Compare against whole words rather than the full string, so a typo in
    // one word of a long description doesn't have to survive a huge distance.
    for (const word of words) {
      if (Math.abs(word.length - query.length) > budget) continue;
      const distance = editDistance(word, query, budget);
      if (distance <= budget) return TIER.fuzzy - distance * 60;
    }
  }
  return 0;
}

// A "strong" hit is a real word match (exact/prefix/word-prefix) on an
// identifying field — name, country, diet, type. Description matches never
// count: several dinosaurs mention "Allosaurus" in their prose, and searching
// that name should return Allosaurus, not everything that talks about it.
const STRONG_THRESHOLD = TIER.wordPrefix;
const STRONG_FIELD_WEIGHT = 0.5;

function scoreDinosaur(dinosaur, query, budget) {
  let total = 0;
  let best = 0;
  let strong = false;
  for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
    const raw = scoreField(dinosaur[field], query, budget);
    if (raw <= 0) continue;
    if (raw >= STRONG_THRESHOLD && weight >= STRONG_FIELD_WEIGHT) strong = true;
    const score = raw * weight;
    total += score;
    if (score > best) best = score;
  }
  // Weight the strongest single field heavily so a great name match always
  // outranks a pile of weak description matches.
  return { score: best * 2 + total, strong };
}

/**
 * Ranked search across the dataset. Multi-word queries are ANDed: every term
 * must match something, which keeps "large theropod usa" meaningful.
 * Returns a new array, best match first; an empty query returns everything in
 * its original order.
 */
function searchDinosaurs(dinosaurs, rawQuery) {
  const query = normalizeText(rawQuery);
  if (!query) return dinosaurs.slice();

  const terms = query.split(/\s+/).filter(Boolean);

  const scored = [];
  for (const dinosaur of dinosaurs) {
    let total = 0;
    let matchedAll = true;
    let strongAll = true;
    for (const term of terms) {
      const { score, strong } = scoreDinosaur(dinosaur, term, typoBudget(term));
      if (score <= 0) { matchedAll = false; break; }
      if (!strong) strongAll = false;
      total += score;
    }
    if (matchedAll) scored.push({ dinosaur, score: total, strong: strongAll });
  }

  // Once anything matches confidently, drop the typo-tolerant long shots:
  // typing a full name should return that dinosaur, not five near-spellings.
  // The fuzzy net only widens when nothing solid was found.
  const confident = scored.filter((entry) => entry.strong);
  const finalists = confident.length > 0 ? confident : scored;

  finalists.sort((a, b) =>
    b.score - a.score || a.dinosaur.name.localeCompare(b.dinosaur.name));
  return finalists.map((entry) => entry.dinosaur);
}

/**
 * Autocomplete suggestions drawn from names and the filterable facets.
 * Each suggestion carries its `kind` so the UI can label it and so selecting
 * a country/diet/type can drive the matching filter instead of the free-text
 * box. Ordered by match quality, names first at equal quality.
 */
function suggestCompletions(dinosaurs, rawQuery, limit = 8) {
  const query = normalizeText(rawQuery);
  if (!query) return [];

  const KIND_ORDER = { name: 0, country: 1, diet: 2, type: 3 };
  const candidates = new Map(); // `${kind}:${value}` -> {value, kind}

  const add = (value, kind) => {
    if (!value || value === 'N/A') return;
    candidates.set(`${kind}:${value}`, { value, kind });
  };

  for (const d of dinosaurs) {
    add(d.name, 'name');
    add(d.diet, 'diet');
    add(d.typeOfDinosaur, 'type');
    for (const country of String(d.foundIn || '').split(',')) {
      add(country.trim(), 'country');
    }
  }

  const budget = typoBudget(query);
  const scored = [];
  for (const candidate of candidates.values()) {
    const score = scoreField(candidate.value, query, budget);
    if (score > 0) scored.push({ ...candidate, score });
  }

  scored.sort((a, b) =>
    b.score - a.score ||
    KIND_ORDER[a.kind] - KIND_ORDER[b.kind] ||
    a.value.localeCompare(b.value));

  return scored.slice(0, limit);
}

/**
 * Best single correction for a query that returned nothing, powering the
 * "Did you mean …?" prompt. Uses a wider budget than search itself, since by
 * this point we already know the strict pass failed.
 */
function suggestCorrection(dinosaurs, rawQuery) {
  const query = normalizeText(rawQuery);
  if (query.length < 3) return null;

  // Deliberately conservative: a wrong "did you mean" is worse than none, so
  // long queries still only earn a few edits of slack.
  const budget = query.length <= 5 ? 1 : query.length <= 9 ? 2 : 3;
  let best = null;

  for (const d of dinosaurs) {
    const name = normalizeText(d.name);
    const distance = editDistance(name, query, budget);
    if (distance <= budget && (!best || distance < best.distance)) {
      best = { value: d.name, distance };
    }
  }
  return best ? best.value : null;
}

if (typeof module !== 'undefined') {
  module.exports = {
    normalizeText,
    editDistance,
    searchDinosaurs,
    suggestCompletions,
    suggestCorrection,
  };
}
