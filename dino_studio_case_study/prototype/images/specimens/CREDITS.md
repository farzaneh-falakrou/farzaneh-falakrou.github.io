# Hero scene assets — sources and licences

These are the only images in this prototype that are **not** from the Natural
History Museum dataset. They exist because the hero scene needs two things the
NHM images can't provide: a dinosaur **isolated on a transparent background**
(the NHM images are flat JPEGs that already contain their own backdrop), and a
separate habitat backdrop behind it.

Every file here is under a licence that permits reuse. CC BY / CC BY-SA
require attribution, which is why this file exists and why the credits are
also shown in the page itself.

## Dinosaur cut-outs

Two artists, both digital paintings rather than 3D renders or flat-ink
cut-outs (both tried and rejected earlier — renders read as plastic against
an 1863 engraving, flat ink reads as cartoonish).

**Emily Willoughby** (e.deinonychus / eloraurorae) — matte, painterly, no
gradient shading or cast shadow. A full search of her ~90 files on Commons
against the dataset's exact 75 genus names turned up only these two; there
isn't a third to add in this artist's hand.

**Fred Wierum** — also hand-painted, close in spirit, but airbrushed with
soft gradient shading and (on two of the three) a faint drop shadow under the
feet that the background-removal script can't fully clean without also
eating the animal's own pale skin tones. Included because no closer stylistic
match to Willoughby exists in a usable licence for these genera — checked
against roughly fifteen other paleoartists active on Commons, all either
unlicensed for reuse, monochrome, graphite sketches, ink-only, or head studies
with no full body.

| File | Source | Artist | Licence |
|---|---|---|---|
| `deinonychus.png` | [Deinonychus ewilloughby.png](https://commons.wikimedia.org/wiki/File:Deinonychus_ewilloughby.png) | Emily Willoughby | CC BY-SA 4.0 |
| `ankylosaurus.png` | [Ankylosaurus magniventris reconstruction.png](https://commons.wikimedia.org/wiki/File:Ankylosaurus_magniventris_reconstruction.png) | Emily Willoughby | CC BY-SA 4.0 |
| `carcharodontosaurus.png` | [Carcharodontosaurus (cropped).png](https://commons.wikimedia.org/wiki/File:Carcharodontosaurus_(cropped).png) | Fred Wierum | CC BY-SA 4.0 |
| `carnotaurus.png` | [Carnotaurus Reconstruction (2022).png](https://commons.wikimedia.org/wiki/File:Carnotaurus_Reconstruction_(2022).png) | Fred Wierum | CC BY-SA 4.0 |
| `centrosaurus.png` | [Centrosaurus.png](https://commons.wikimedia.org/wiki/File:Centrosaurus.png) | Fred Wierum | CC BY-SA 4.0 |

The set is chosen by which genera actually have suitable work available, not
the other way round; every other dinosaur in the dataset is still reachable
through search, the list and the charts.

**Camptosaurus** (`camptosaurus.png`, no longer used by the showcase wheel — file
kept in case it's wanted back) and **Anchiceratops** (`anchiceratops.png`)
were supplied directly by the site owner rather than sourced from Commons —
artist and licence unconfirmed, so no attribution line is shown on the page
for these two. Backgrounds were removed with the same matting script as the
NHM-adjacent set above. Replace with a Commons-sourced, cleared-licence image
before this prototype is treated as anything other than a design exercise.

**Albertosaurus** (`albertosaurus.png`) was supplied pre-cut (transparent
background already present, no matting needed) — same provenance caveat as
the two above.

**Alectrosaurus** (`alectrosaurus.png`), **Edmontonia** (`edmontonia.png`) and
**Coloradisaurus** (`coloradisaurus.png` — not used by the showcase wheel, file
kept in case it's wanted back) were also supplied by the site owner,
described as AI-generated colourisations of the same genera's NHM dataset
reconstructions. Supplied pre-cut with a correct alpha channel already present,
so no matting was run — only a crop to the alpha bounding box (2% padding) and
a resize to ~1100px on the long edge, to match the rest of the set. Artist and
licence of the underlying source are unconfirmed and the derivation is the site
owner's own statement, so no attribution line is shown on the page for these
three; same provenance caveat as the three above applies before this prototype
is treated as anything other than a design exercise.

### Background removal

None of the five source files were true cut-outs — all opaque JPEGs/PNGs on a
flat white studio background. There's no image-editing tool in this
environment (no ImageMagick, no cwebp), so a small stdlib-only PNG matting
script was written for this specifically (`zlib`-decode the raw scanlines,
border-connected flood-fill the white, feather the boundary by luminance).
A second pass was added after the first version left solid white patches
inside fully enclosed pockets — a bent leg against the body, the gap under a
raised foot — that a border-seeded flood fill can never reach, since nothing
connects them to the canvas edge; anything still white and unvisited after
the main fill is, by construction, walled off on every side and safe to clear
the same way. Knocked out 70–85% of each canvas depending on the animal's
silhouette.

## Habitat backdrops

Two plates, both wood engravings after Riou from Louis Figuier's *La Terre
avant le déluge* (1863) — same artist, same technique, so the two halves of
the wheel read as one continuous landscape rather than two different sources.

| File | Source | Licence |
|---|---|---|
| `habitat.jpg` | ["An ideal landscape of the Muschelkalk sub-period"](https://commons.wikimedia.org/wiki/File:An_ideal_landscape_of_the_muschelkalk_sub_period_with_retile_Wellcome_V0023199.jpg), Wellcome Collection | CC BY 4.0 |
| `habitat2.jpg` | ["An ideal landscape of the Upper Oolitic period"](https://commons.wikimedia.org/wiki/File:An_ideal_landscape_of_the_upper_oolitic_period_with_reptiles_Wellcome_V0023201.jpg), Wellcome Collection | CC BY 4.0 |

Each is cut from the full-resolution plate as an exact **2:1 crop** (1800×900,
downsized to 1800px wide), from a region with no animals in it — the hero
supplies its own dinosaur, and a second creature in the backdrop would read as
a mistake. `habitat.jpg` is the breaking wave and rocky treed bank;
`habitat2.jpg` is the reed-and-water midground with distant palms.

The 2:1 aspect isn't arbitrary: each plate fills exactly one half of the
`.showcase-wheel-spin` disc (`background-size: 100% 50%`), unwarped, at its
true aspect ratio. `::before` holds `habitat.jpg` at the top pole and
`::after` holds `habitat2.jpg` at the bottom, rotated 180° so it's upright
when its own pole comes to the top of the spin. This replaced an earlier
version that wrapped the engraving as a continuous texture around the full
circumference (a canvas panorama-into-annulus warp, `buildShowcaseRing` in an
earlier revision of `js/app.js`) — the warp guaranteed ground at every spin
angle, but it bent the plate's straight hatching into concentric arcs, which
read as a woven texture rather than a landscape. The two-half version gives up
continuous ground coverage at intermediate spin angles in exchange for the
plates looking like an actual place.

## Processing notes

Cropped and resized with `sips`. All raster formats then had metadata
stripped:

- The engravings each carried a **~400 KB embedded ICC colour profile** —
  multiple full APP2 segments — which is why resizing barely changed file
  size until the profile was removed. Stripping APP1–APP15 from JPEGs
  restores the expected size-to-quality ratio with no visible change.
- The dinosaur PNGs were already clean; the matting script's own PNG encoder
  writes minimal chunks (IHDR/IDAT/IEND only), so no separate strip pass is
  needed for those.

If you re-crop or re-export any of these, strip metadata again or the ICC
profile will silently come back and dwarf the actual image data. If you
re-crop the habitat plates to a different aspect ratio, update
`background-size: 100% 50%` in `.showcase-wheel-spin::before/::after`
accordingly, or the halves will stretch.
