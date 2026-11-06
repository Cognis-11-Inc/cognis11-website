# Milestone 004 — A richer site and a readable research record

November 5, 2026, America/Toronto. The Operator requested a louder mix, richer pages, quotations and author/Zenodo records through v8.1, Möbius Automata, verification of the separately reported About/audio changes, a fresh ZIP, and Cloudflare deployment.

## Delivered

- Home exposes the v8.1 manuscript, ORCID, HOUND, Digital Bee Hive, Möbius Automata, Phalanx, and the consulting arrangement. Its research disclosures carry fuller context.
- Research contains three highlighted preprints, six further author-linked records, short attributed public-abstract excerpts, four public project entries with evidence/limits, developed research directions, and reading prompts.
- The **original published 117-page v8.1 PDF** is available in the local reader at `/research/umbra-v8-1/`, as well as through an open/download link. It was downloaded from the public Zenodo record, not generated from a private manuscript. [Publication Sources](./PUBLICATION-SOURCES.md) records the author verification, metadata sources, PDF origin, and checksum.
- About preserves the separately added philosophy, engineering, and project sections. It links the founder's ORCID and manuscript. The reported Phalanx metric is explained as imitation agreement, and private prototypes are labelled accordingly.
- Consulting adds inquiry examples, engagement steps, and native practical answers. The approved free evaluation, CAD $100/hour, three-hour per-client weekly cap, billing scope, and separate-contract option remain intact. Total weekly client capacity remains undecided.
- Contact adds optional email outlines for evaluation, research, and collaboration, plus initial-message guidance and practical answers. No form backend or email sending was added.
- The music uses `0.32 × 0.85` master gain. The separately applied `0.85` adjustment is preserved; live playback, offline rendering, and signal tests now share both parameters. The updated full preview is `release/cognis11-ambient-v3-preview.wav` (ignored).
- An unused preparation-notice component was removed. The static reader is included in the sitemap and Research navigation state.

During work, the live site was checked rather than assumed stale: version `450b862c-e371-4ff8-bbbb-878ee39bc825` already contained the separately uploaded About revision. Its additions and gain change were incorporated. The completed combined build was subsequently uploaded as version `514cfb5a-e2a5-4600-b58b-b619b306f4d1`.

## Executed verification

| Exact command | Result |
| --- | --- |
| `ASTRO_TELEMETRY_DISABLED=1 npm run check` | Succeeded, final **41 files, 0 errors, 0 warnings, 0 hints**. |
| `ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded; seven HTML pages including the reader and 404, plus SEO/assets. |
| `CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | An initial 50-check run failed two new test locators because decorative `+` text prevented exact text matching. Corrected the locator to target the native summary. A later invocation failed before tests because the preview could not start on the occupied default port. The test-owned port moved to 4327 without stopping the other server. Successful root run: **52/52**, 27.0 seconds. |
| `ASTRO_BASE_PATH=/foundation-review ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded with the final project/library content. |
| `ASTRO_BASE_PATH=/foundation-review CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | **52/52 passed**, 27.2 seconds. |
| `CHROMIUM_PATH=/usr/bin/chromium npm run audio:render` | Succeeded; same live gain parameters, native offline full-score render. Latest preview peak `0.0992818`, RMS `0.00979690`, below clipping. |
| `pdfinfo public/research/proto-pineal-v8.1.pdf` | Succeeded: 117 pages, 611325 bytes, no encryption or embedded JavaScript. |
| `ASTRO_TELEMETRY_DISABLED=1 npm run package` | Succeeded; restored root-domain output and generated a **20-file, 708178-byte ZIP**. An additional Python check matched every archive member byte-for-byte to `dist/`, including the reader and PDF. |
| `npx --yes wrangler@4.158.0 deploy --config .local-notes/cloudflare-assets.jsonc --no-autoconfig --dry-run` | Succeeded. |
| `npx --yes wrangler@4.158.0 deploy --config .local-notes/cloudflare-assets.jsonc --no-autoconfig --message 'Milestone 004: full v8.1 PDF, ORCID, publications, projects, richer pages and raised audio'` | Succeeded on the verified account/existing app: twelve changed assets uploaded, eight reused. |

The Playwright colour-environment warning remains harmless. No new production dependency was added. New tests exercise the local PDF/reader, author/provenance links, Research navigation, retained About headings, practical answers, and email outlines without JavaScript. The suite also retains its previous audio, discovery, accessibility-rule, reduced-motion, session, and responsive checks. It does not send email or rerun the cited projects' experiments.

Public verification returned 200 for six content routes on each domain, exact JS/CSS bytes, and the original PDF checksum/MIME type. Focused live desktop/mobile checks verified the About changes, all new public project entries, local v8.1 reading, a raised master-gain value, persistent audio, mute/suspend, one audio context, no overflow, and zero page errors. The full local suite is distinct from those live smoke checks and GitHub's separate check/build job.

## Source changes

New reusable presentation: `PublicationLibrary.astro`, `ReadingGrid.astro`, and `ReadingQuestions.astro`. New public content modules: `publications.ts`, `editorial.ts`, and `contact.ts`. New reader route/PDF and `tests/reading.spec.ts`. Existing five pages, research/project data, header/sitemap, styles, audio parameters/renderer, test configuration, README, and delivery/provenance documentation were updated. The old unused `ContentNotice.astro` was removed; historical delivery records remain.

The engine/private source, newer unpublished work, and non-public collaboration reports remain outside this repository. Published manuscripts through v8.1 are available by the author's express direction. No client count, credential, testimonial, endorsement, or peer-review claim was invented. Listening judgment, physical device checks, free-evaluation duration, and bespoke contract terms remain Operator review decisions. The original PDF's internal accessibility was not certified. No DNS or email settings changed.
