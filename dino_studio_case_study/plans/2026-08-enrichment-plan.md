# Dino Studio — enrichment plan (2026-08)

Working notes so this can be picked up later without re-deriving the research.
Source repo: `dino_studio_case_study/prototype/`. All verification below was
done with real `curl` requests against the actual 75 genus names in
`data/dinosaurs.json`, not from documentation.

## Status as of this session

Done and committed:
- Taxonomy heading moved to sit directly above the ladder instead of at the
  bottom of the two-column `.detail-top` row — it used to be a label at the
  end of the text column while the actual tree was a full-width block below
  the whole row, so the label promised content that could be a full column's
  height away depending on the record.
- Map click-to-highlight fix, UK double-counting fix, list-scroll regression
  fix, Leaflet tooltip/zoom-control theming — all unrelated bugs found while
  driving the prototype, already committed before this item was started.
- **Dig sites (item 1): built, both known bugs fixed, then deliberately
  switched off.** Read the full reasoning below before re-enabling — turning
  it back on without addressing the auto-scroll and disagreement-display
  points would reproduce the exact problem that got it turned off.

### Dig sites: what happened, in order

1. Built `tools/fetch-occurrences.py`, prebaking PBDB occurrence coordinates
   for all 75 genera into `data/occurrences.json` (see item 1 below for the
   mechanism). Wired into the map: selecting a dinosaur was supposed to plot
   its real dig sites instead of flying to a country centroid.
2. **User reported the markers weren't visible.** Root cause: `preferCanvas:
   true` means the country GeoJSON layer and the circle markers share one
   canvas render target. `focusMapOnDinosaur` was calling `showDigSites()`
   (adds the markers) *before* looping over `countryLayer` and calling
   `layer.bringToFront()` on the matched country polygon — `bringToFront()`
   redraws that polygon last, and its opaque (`fillOpacity: 1`) fill painted
   directly over the markers. **Fixed:** reordered so the country highlight
   runs first and dig sites are added after, in `focusMapOnDinosaur` in
   `js/app.js`.
3. **User separately asked whether the sites even agree with the dataset's
   own `foundIn` field.** They often don't. Checked properly with a
   point-in-polygon script (logic now lives in `tools/fetch-occurrences.py`
   as `point_in_ring` / `point_in_geometry` / `build_country_lookup`, reusing
   the real `COUNTRY_GEO_NAMES` alias table from `js/data.js` via
   `load_country_geo_names()` so the two never drift apart):
   - Of 1289 raw occurrence records checked, **133 (10%) land in a country
     the record's own `foundIn` does not list.**
   - That aggregate number hides the real shape. **44 of 75 genera (59%)
     have zero disagreement.** Most of the remainder are clean with a small
     noisy minority (Camarasaurus 3 bad / 137 total, Allosaurus 2/147).
   - **But it is genuinely bad for a specific, small group**, and this
     correlates almost genus-for-genus with well-documented, real taxonomic
     disputes rather than being random noise: Ammosaurus 3/3 (100% — its
     type material is American, but PBDB's own Ammosaurus occurrences are
     all in Nova Scotia, Canada, material sometimes assigned to the genus
     but not the type specimen), Alectrosaurus 17/19 (89% — a poorly-known
     Central Asian tyrannosauroid with a long history of disputed
     assignments), Edmontonia 11/16 (69%), Antarctosaurus 5/8 (62%),
     Daspletosaurus 11/21 (52%), Dacentrurus 12/29 (41%), Carcharodontosaurus
     18/44 (41% — historically a wastebasket taxon for large theropod teeth
     across Africa, much of it since reassigned to other genera).
   - **Fixed:** `tools/fetch-occurrences.py` now drops any occurrence whose
     resolved country is not in the record's own `foundIn` before writing
     `data/occurrences.json`. Re-running it: 74/75 genera keep at least one
     site (28 KB, was 31), 133 occurrences dropped, and Ammosaurus now has
     **zero** sites left — correctly, since none of PBDB's occurrences under
     that name actually agree with where the museum places it.
   - **Caught and corrected a wording mistake before shipping it:** the
     first draft of a "for genera the filter empties out" fallback said
     *"No confirmed excavation sites for this genus."* User caught that this
     is false — sites exist, they just disagree with `foundIn`. That is a
     materially different fact and needs different, honest language if this
     ships later (see the open display question below). Do not reuse that
     exact sentence.
4. **User asked, given all that, whether the feature is worth keeping at
   all**, and separately noted that selecting a dinosaur auto-scrolls to the
   detail panel (currently at the bottom of the page), which means the map —
   and any dig-site markers on it — is scrolled out of view at the exact
   moment they'd appear. Conclusion reached together: **the underlying data
   and pipeline are sound and worth keeping (cheap, sourced, now genuinely
   accurate), but showing it as unlabelled dots on the choropleth,
   discoverable only by scrolling back up after the auto-scroll carries you
   away, isn't earning its cost.** Decision: switch it off for now rather
   than ship something nobody will see, and fold it into the item 5 detail-
   panel rebuild later as a labelled fact instead of map decoration.
5. **Implemented the off switch**, without deleting any of the correctness
   work: `const DIG_SITES_ENABLED = false` near the top of the IIFE in
   `js/app.js` gates both the `data/occurrences.json` fetch in the boot
   sequence and the `showDigSites()` call in `focusMapOnDinosaur`. With it
   `false`, the map behaves exactly as it did before dig sites existed —
   verified: country flyTo/highlight on selection still works (checked
   Citipati → Mongolia: amber border, zoom 3, centered correctly), zero
   circle markers on the map, no console errors, both test suites pass. The
   `.map-note` copy in `index.html` was trimmed back to only the (still true)
   choropleth-shading sentence — it previously also claimed the dig-site
   behaviour, which would have been a lie with the flag off.

### Open question for whoever re-enables this: what do you show for the ~7
genera where the filter leaves few or no sites?

Two options were discussed, no decision made yet:

- **Baseline, cheap:** treat it like every other gap already in this
  dataset — same visual language as "55 hidden — weight not recorded" /
  "Length not recorded: Eolambia" (muted text, left accent stripe). But the
  *wording* needs to be honest in a way the first draft wasn't — something
  like *"No excavation sites in this dinosaur's own recorded range"* or
  *"PBDB's occurrences under this name are outside [country] — see below"*,
  not *"no confirmed sites"* (false; sites exist, they disagree).
- **Richer, more work:** keep the disagreeing points but render them as a
  visually distinct, clearly labelled secondary category, with one line
  explaining the specific disagreement (e.g. the Ammosaurus/Nova Scotia
  case above). More honest and more genuinely interesting — it turns "two
  sources disagree" into a fact about how contested real paleontology
  taxonomy is, rather than either hiding it or presenting a near-empty map
  as if it were complete — but needs per-genus editorial judgment rather
  than one generic sentence, and more UI.

No commitment either way — decide when item 5 is actually being built, with
the genus list above in hand so it's not re-derived.

## Revised plan, in order

### 1. Dig sites on the map (prebaked PBDB) — biggest visual payoff, zero runtime risk

**Built and correctness-fixed, but switched off** — see the full account
above. Do not simply flip `DIG_SITES_ENABLED` back to `true` without also
addressing (a) where in the page flow dig sites would actually be seen, given
the auto-scroll-to-detail-panel behaviour, and (b) the open display question
for the ~7 disagreement-heavy genera.

Mechanism: `tools/fetch-occurrences.py` queries
`https://paleobiodb.org/data1.2/occs/list.json?base_name=<all 75 genera>&show=coords,loc,strat`
in one request, cross-checks every point against the record's own `foundIn`
(point-in-polygon against `data/world-countries.geo.json`, using the real
`COUNTRY_GEO_NAMES` alias table from `js/data.js` so the two never drift
apart), drops disagreeing points, and writes `data/occurrences.json`.
`tools/bundle-data.py` wraps it as `data/occurrences.data.js` for the
`file://` fallback path (same pattern as the other two datasets). Current
numbers after the disagreement filter: 74/75 genera retain at least one site
(Ammosaurus is the one exception — see above), 949 distinct points, 28 KB.
Loading and rendering are additive and silent on failure — with the flag on,
the choropleth would behave exactly as before if the occurrences file were
absent; with the flag off, it already does.

Why prebaked and not a runtime call: the project's whole posture is that it
works offline and from `file://`; a runtime fetch would add a network
dependency, a rate limit, and a failure mode that doesn't otherwise exist.
`Access-Control-Allow-Origin: *` verified anyway, in case a live variant is
ever wanted for a "refresh from PBDB" affordance.

Attribution: PBDB data is CC BY 4.0. Credit it in the UI again once this is
re-enabled — it was removed from `.map-note` along with the rest of the
dig-site copy when the feature was switched off, since the page shouldn't
claim a behaviour that isn't active.

### 2. "Latest in paleontology" — baked RSS + scheduled refresh

**Not started.**

Verified: dinosaur-specific news APIs are dead ends. NewsAPI requires a key
(disqualifying for a static page) *and* sends no CORS header at all — doubly
blocked. GDELT is the only keyless CORS-enabled news source
(`Access-Control-Allow-Origin: *` confirmed) but the content is unusable for
this purpose: querying "Tyrannosaurus" — the most newsworthy genus that
exists — over a 6-month window returned celebrity-culture coverage of an
animatronic exhibit and a handbag auction, not paleontology. For an obscure
genus like Chinshakiangosaurus the realistic yield is zero. A per-dinosaur
news panel would be empty for ~70/75 records and embarrassing for the rest.
Do not build a live "news API" call.

The real fix is a build-time bake, same shape as the occurrence fetch,
because **CORS only blocks the browser — it does not block a script run at
build time**. Verified directly:

- `https://www.sciencedaily.com/rss/fossils_ruins/dinosaurs.xml` — HTTP 200,
  no CORS header (confirming it can't be fetched live from the browser), but
  fetched server-side with `curl -A "Mozilla/5.0" ...` returned 60 items,
  freshest dated the day of testing (9 Aug 2026). Sample titles: "Dinosaurs
  became giants — so why did they never become tiny?", "Did T. rex leave
  these 66-million-year-old bite marks?".
- `https://www.sci.news/paleontology/feed` — 20 items, e.g. "Fossil Find in
  China Reveals Dinosaur Family Never Before Seen in East Asia".

Plan: `tools/fetch-news.py` (mirror the shape of `fetch-occurrences.py`),
parse both RSS feeds with a small regex or `xml.etree`, keep title + link +
pubDate + source, write `data/news.json` → bundle as usual. This is
field-wide news (not per-dinosaur — no per-genus tie-in is possible, be
upfront about that in the UI copy), rendered as a small panel, e.g. "Latest
in paleontology" with 5–8 items.

**Scheduling — flagged as needing a decision, not yet made.** Keeping this
current requires a GitHub Actions workflow that re-runs the fetch on a
schedule and commits the result — the first piece of CI this project would
have, and it writes to the repo autonomously. The bake script itself should
be built regardless (usable via a manual `python3 tools/fetch-news.py` run
before each portfolio update); whether to also wire the scheduled workflow is
the user's call to make explicitly before it's added.

### 3. "Recent research on this dinosaur" — live OpenAlex in the detail panel

**Not started.**

Verified live and CORS-open (`Access-Control-Allow-Origin: *`, no key):
`https://api.openalex.org/works?search=<genus>&per-page=3&sort=publication_date:desc&mailto=<contact>`.
Tested across a spread including obscure genera — Becklespinax: 8 works,
Chinshakiangosaurus: 20, Citipati: 182 (top result dated 2026), even
Aardonyx and Cetiosauriscus return real, dated papers. This is the
legitimate "per-dinosaur news" the field-wide RSS panel can't be.

This one *can* be a runtime call — unlike occurrences/news, it's naturally
scoped to "whichever dinosaur is currently selected," so prebaking all 75
would mean shipping data for records nobody looks at. Fire on selection,
cache the response in a `Map` keyed by genus so re-selecting is free, and
`.catch(() => {})` into a section that simply doesn't render if the request
fails — never block or spinner the render path on it. Some relevance noise
should be expected and filtered (a genus-name search occasionally surfaces
an unrelated paper that happens to share the word) — spot-check before
shipping.

### 4. Wikipedia prose + second image — live, all 75 resolve

**Not started.**

Verified: `https://en.wikipedia.org/api/rest_v1/page/summary/<Genus>` is
CORS-open (`*`), no key, and **75/75 genera resolve**, every one
`type: "standard"` (zero disambiguation pages), 74/75 carry a thumbnail.
Keyword-screened all 75 extracts for dinosaur/clade/period terms — zero
false positives (e.g. "Citipati" correctly resolves to the oviraptorid, not
the unrelated Buddhist term).

One genuinely interesting wrinkle: `Becklespinax` silently redirects to
`Altispinax` because the genus has been synonymised. The API follows the
redirect and returns the right animal under the new title — display
`response.title`, not the record's own `name`, or the panel will show
Becklespinax's heading over prose about Altispinax. Treat the mismatch as
content, not a bug: "now considered a synonym of Altispinax" is a genuinely
good line to surface.

Same runtime pattern as item 3: fetch on selection, cache by genus, fail
silently, never block the render. **Licensing note that must not be
skipped:** Wikipedia summaries are CC BY-SA 4.0, which requires attribution
and a link back to the source article (`content_urls.desktop.page` is in
the response). Do not blend this prose into the existing NHM `description`
field — different licence, different provenance, and merging them silently
would misrepresent both. Render it as its own credited block.

### 5. Detail panel rebuild — the container the last two land in

**Not started**, but partially informed by a design-agent report already
delivered earlier in this conversation (not reproduced here — re-read that
report, or re-run the same critique, before starting). Its headline finding:
`.detail-top`'s rigid `240px 1fr` two-column split was tuned for a "data-rich"
case that's actually rare (64 of 75 records produce ≤4 lines in the right
column; 10 produce 60+ lines; there is no typical case), producing either a
large dead void or unreadable ragged-right wrapping depending on the record.
Prescription on file: three full-width bands (head / body-with-plate-and-
specs / taxonomy), a spec grid that reflows instead of a fixed ledger, and
`--accent` freed from double-duty as both "inert label colour" and
"selected/interactive colour."

This is listed as item 5, not item 1, deliberately: items 3 and 4 both add
new content blocks to the detail panel (a research-papers list, a Wikipedia
prose block), and building the container before knowing what has to fit in
it risks a rebuild-then-immediately-modify. Do the rebuild once 3 and 4's
markup shape is known, or explicitly fold their layout needs into the
rebuild spec before starting it.

### 6. Games — Bigger or smaller?, Who's this?

**Not started, least specified.** Two concepts on the table:

- **Bigger or smaller?** — two dinosaur silhouettes (reuse the size-chart's
  human-scale drawing logic), guess which is longer, scored streak. `length`
  covers 74/75 so the answer is always unambiguous except for Eolambia,
  which should simply never be drawn into a matchup.
- **Who's this?** — show the specimen plate with the name hidden, reveal
  clues (diet, period, country) one at a time until guessed or given up.

Lowest priority on the list and the most different in character from the
rest of the piece (which is an explorer, not a game) — worth a deliberate
go/no-go check-in before starting rather than building on momentum.

## Constraints that apply to every item above

- No backend, no build step beyond plain Python scripts + the existing
  `tools/bundle-data.py` pattern, must work from `file://`.
- No item may require an API key — a static page cannot hold a secret.
- Anything added must degrade silently: missing data, a failed fetch, or
  being offline should leave the page exactly as good as it is today, never
  broken or half-rendered.
- Prebake when the data is small and dinosaur-independent (occurrences,
  news). Fetch live when it's naturally scoped to the current selection and
  reasonable to cache (OpenAlex, Wikipedia).
