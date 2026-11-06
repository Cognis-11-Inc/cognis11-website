# Design Revision 001 — A welcoming encounter

November 5, 2026. This is a local revision within the first milestone; it does not authorize publication or extend the site into a product demonstration.

Historical record. Later authorization and changes are recorded in [Milestone 002](./MILESTONE-002.md); current deployment status is in [Hosting](./HOSTING.md).

## Design direction

The revision follows the existing Cognis 11 corporate direction: abyss black, reflective obsidian, cyan/electric-blue signal, a custom waveform inscription, and meaningful response to interaction.

Unfamiliar material, hidden structure, and user-paced discovery provide the character. Readable navigation, clear language, visible controls, and accessible native disclosures support approachability.

## Corporate source and authority

The source is `COGNIS_11_INC_AESTHETIC_RULE_BOOK_v0_1.md` (separately maintained corporate identity document), dated August 15, 2026. In particular:

- Sections 1.3–1.5 describe the sealed exterior, concealed depth, engineering and authored creative practice, and progression from curiosity through contact to revelation.
- Sections 4–6 define the waveform, engineered inscription, abyss black, cyan/electric-blue signal, cold white, and mineral neutrals.
- Sections 7–9 define the reflective black-mirror surface, meaningful response, and motion tied to actual input.
- Section 11 keeps controls legible and operator control clear.

The rule book locks the corporate direction but leaves exact production colour values, final typography, and final mark approval unresolved. The website therefore follows the existing house direction without presenting its chosen CSS values as a newly approved production standard.

The existing candidate vector was copied unchanged from:

```text
Proto-Pineal/Documentation/Corporate_Identity/marks/v0.2/
COGNIS_11_INC_LOGO_FULL_COLOR_TRANSPARENT_v0_2.svg
```

Local copy: `public/brand/cognis11-mark-v0.2.svg`.

Both files were compared with `sha256sum`; both have hash:

```text
0c08807a5b102cfd6747f00afed8a3be0b08673b8c25efe22083dbedfa68e788
```

The SVG’s embedded candidate/pending-acceptance metadata is preserved. Header and footer use viewport crops of the same file without changing its geometry. The favicon uses the source waveform path family and colour definitions, adapted to a square viewport. These presentation derivatives do not constitute a newly locked logo master. No corporate source document or source asset was edited.

## What changed

| File | Change |
| --- | --- |
| `src/styles/global.css` | Replaced green/charcoal tokens with abyss, black-mirror, cyan, electric-blue, cold-white, and mineral-neutral roles. |
| `src/styles/pages.css` | Revised hero hierarchy, readable mobile copy, responsive question disclosures, and the creative-practice section. |
| `src/pages/index.astro` | A human question opens the page; research directions become questions visitors can open; the creative practice appears explicitly. |
| `src/components/ContactInstrument.astro` | New original paired-pillar illustration with a native disclosure. Contact opens the shell, reveals traces, explains the gesture, and provides a continuity-research link. Pointer reflection/tilt is a small optional enhancement. |
| `src/components/RelationDiagram.astro` | Removed the superseded static paired-circle diagram. |
| `src/components/Wordmark.astro` | Uses the existing candidate Cognis inscription/mark through viewport crops. |
| `src/components/SiteHeader.astro`, `SiteFooter.astro` | Adapted the shared chrome to the actual corporate mark and colour roles. |
| `src/components/BootSequence.astro` | House-colour black-mirror presentation; timing, wording, skip, and fallback behaviour preserved. |
| `src/layouts/BaseLayout.astro` | Updated browser theme colour. |
| `src/lib/research.ts` | Added plain-language question invitations to the four supplied directions. |
| `src/pages/about.astro` | Introduced the engineering/creative-practice relationship from the corporate doctrine. |
| `public/brand/cognis11-mark-v0.2.svg` | Added the unchanged source candidate asset. |
| `public/favicon.svg` | Replaced the invented mark with the source waveform derivative. |
| `tests/foundation.spec.ts` | Added interaction, open-state accessibility, pointer/touch, reduced-motion reset, and no-JavaScript disclosure coverage. |
| `README.md`, `docs/MILESTONE-001.md`, this file | Document current behaviour, source provenance, and the superseded first-pass design. |

No packages were added or changed. Research/consulting achievements, biographies, prices, testimonials, and public contact details remain unasserted.

## Behaviour and evidence boundary

The homepage instrument is an interactive illustration. Its opening and signal reveal follow a real user click, tap, Enter, or Space through native `<details>/<summary>`. Pointer highlights and tilt respond only to local pointer movement. No autonomous ambient loop, remote data, tracking, sound, or inferred visitor state is involved. Research questions use the same native disclosure model and link to real local research sections.

Reduced-motion visitors receive immediate state changes with animations and pointer tilt disabled. The native disclosures and all navigation remain functional without JavaScript. Keyboard focus is visibly marked at the instrument’s action label. The illustration explicitly states that no live intelligence is connected.

## Executed validation

| Exact command | Result |
| --- | --- |
| `ASTRO_TELEMETRY_DISABLED=1 npm run check` | Succeeded: 0 errors, 0 warnings, 0 hints. Run after the implementation and after the test extensions. |
| `ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded: six static HTML pages plus SEO and local assets. |
| `CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | Succeeded: 28/28 desktop/mobile checks. |
| `ASTRO_BASE_PATH=/foundation-review ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded. |
| `ASTRO_BASE_PATH=/foundation-review CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | Succeeded: 28/28 desktop/mobile checks, including the final copy-spacing and focus-indicator refinements. |

The default `ASTRO_TELEMETRY_DISABLED=1 npm run build` was run again after project-path checks to restore final output to `/` for the intended domain. The first root-path browser run took 15.8 seconds; the project-path run took 15.7 seconds. No build, type-check, or browser test failed during this revision. The runner emitted the existing harmless `NO_COLOR`/`FORCE_COLOR` environment warning.

The expanded tests exercise the open instrument and an open research question with axe-core, pointer response, touch activation, keyboard closing, reduced-motion reset, and both disclosures with JavaScript disabled. Existing session, skip, offline intro, page metadata, active navigation, internal links, external-request absence, and 320–1920px overflow checks remain. Desktop and mobile screenshots of the resting and open instrument were visually inspected. A mobile text-spacing defect found in screenshot review was corrected before the project-path validation.

Automated accessibility checks cover the rules axe can assess in Chromium; they do not establish complete WCAG conformance. Safari, Firefox, physical devices, and manual screen-reader use remain untested. No hosted CI or deployment was run.

## Still open for the Operator

The emotional effect remains subject to creative review. The candidate mark’s production approval, reading/display font selection, exact calibrated colour values, and any sonic identity remain open in the corporate doctrine. Public content gaps from Milestone 001 remain: approved research descriptions/evidence, consulting scope, company biographies/background, and a confirmed public contact channel.

The site remains local. No deployment, DNS, email, domain registration, remote repository, or publication setting was changed.
