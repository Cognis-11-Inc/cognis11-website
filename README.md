# Cognis 11 Inc. website

The official Astro static website for **Human Operator × Synthetic Intelligence**. Live at **https://cognis11.xyz** on Cloudflare Workers Static Assets. Public website source: **https://github.com/Cognis-11-Inc/cognis11-website**. See [the hosting record](docs/HOSTING.md) and [current delivery record](docs/MILESTONE-002.md) for verification and remaining decisions.

The current visual revision follows the Cognis 11 Aesthetic Rule Book: abyss black, reflective obsidian, cyan/electric-blue signal, the existing candidate corporate mark, and depth revealed through interaction. See `docs/DESIGN-REVISION-001.md` for source provenance and the response to the Operator’s review.

## Develop and review

Use Node.js **22.23.4 or newer** (an even-numbered release) and npm. This milestone was run with Node 26.13.0 and npm 12.2.1. Dependencies are pinned in `package.json` and `package-lock.json`.

```sh
npm ci
npm run dev
```

Open the Local URL printed by Astro, normally `http://localhost:4321/`. All styles, graphics, and fonts are local; visitors make no third-party requests. Client JavaScript supplies the optional intro, pointer reflection, synthesized audio, and Astro's client navigation so music continues between pages. The instrument and research questions use native HTML details/summary and work without JavaScript. There is no analytics, tracking, contact backend, or external font service.

## Validate

```sh
ASTRO_TELEMETRY_DISABLED=1 npm run check
ASTRO_TELEMETRY_DISABLED=1 npm run build
```

The production site is emitted into `dist/`. Preview that build:

```sh
npm run preview
```

Browser checks use Playwright and axe-core as development dependencies. On this workstation:

```sh
CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e
```

On a machine without a system Chromium, install Playwright’s browser with `npx playwright install chromium`, then run `npm run test:e2e`. That installation command was not needed or executed for this milestone. Build before running browser checks: the tests exercise the emitted static files, not the dev server. The configuration starts and stops its own loopback-only preview server. Test screenshots and failure traces are written to ignored `test-results/`.

The suite covers intro/session/fallback behavior, offline intro playback, native interactions without JavaScript, keyboard/touch/pointer access, metadata and links, external-request absence, and overflow from 320 to 1920 CSS pixels. Audio checks observe the real Web Audio graph and output signal, stereo carriers, mute/resume, navigation persistence, and reduced-motion behavior. Axe checks WCAG A/AA rules on all five pages, the introduction, the open instrument, and an open research question in Chromium; they do not replace manual assistive-technology review. GitHub Actions separately runs dependency installation, type checking, and a static build.

Astro 7 can automatically background a server when an agent starts it. The Playwright preview uses `--ignore-lock` to retain process ownership. To stop an ordinary background server:

```sh
npm run dev -- stop
npm run preview -- stop
```

## Structure

- `src/pages/`: Home, Research, Consulting, About, Contact, a 404 page, and generated SEO files.
- `src/layouts/BaseLayout.astro`: semantic document, social metadata, navigation, footer, client router, and optional intro.
- `src/components/`: shared presentation, native instrument, boot sequence, research artifact, and persistent audio controls.
- `src/lib/`: site identity/links, research directions, cited public artifacts, and procedural score.
- `src/styles/`: custom global tokens, responsive layouts, and reduced-motion rules.
- `public/`: the candidate Cognis 11 SVG mark, waveform favicon, local social-sharing card, and `.nojekyll` for static Pages output.
- `scripts/package_site.py`: optional ZIP packaging with Python's standard library.
- `tests/`: browser behavior, accessibility, and static-output verification.
- `docs/`: delivery history, current hosting, audio design, and unresolved content/design decisions.
- `.github/workflows/check.yml`: validation on pushes and pull requests; it does not deploy.

## Introduction behavior

`BootSequence.astro` is enabled only on Home with the layout’s `intro` property. Its five lines follow the supplied wording. Playback lasts approximately **3.66 seconds**, including the fade. The skip button receives initial focus; Enter, click/tap, and Escape dismiss it. Closing returns focus to the homepage heading and unlocks scrolling. The native modal prevents keyboard interaction with the background during playback.

The intro uses `sessionStorage` key `cognis11:intro-seen:v1`, which is scoped to the origin and browser tab’s session. It is marked seen before playback, so reloads and return visits in that session do not repeat it. A new session may show it again. With reduced motion enabled, inaccessible storage, unsupported native dialogs, or JavaScript disabled, the homepage is immediately available. Changing to reduced motion during playback closes it. To review the intro again, clear that session key in browser developer tools or use a new private session.

All timing logic is inline; the animation needs no network access after the document and its stylesheet have loaded. Both the intro and homepage instrument explicitly identify the interaction as symbolic, with no live connection. To omit the intro entirely, remove the `intro` property from Home’s `BaseLayout`.

## Sound and motion

Visitors can choose **Enter with sound** in the intro or **Enable sound** in the persistent sound bar. The single control then becomes **Mute sound / Unmute sound**. A fixed quiet mix fades in; sound starts only after a visitor gesture. A full reload requires a new gesture. Navigation through Astro's client router preserves one audio context and the current preference. Hidden tabs suspend the context.

The original dark ambient score is synthesized locally by Web Audio: a 111 Hz root, minor harmony, slow pads, filtered pulse, and deterministic reverberation. The stereo carriers are 438.5 and 449.5 Hz, separated by 11 Hz. Headphones reveal the stereo layer. These are composition parameters, with no claim about neurological effects.

Music, harmonically related interaction cues, and the instrument's restrained light/breath share a 66 BPM transport. Visual phase uses the audio output timestamp with a latency fallback. Reduced motion disables the visual modulation; the sound button remains available. Parameters and timing compensation live in `src/lib/sound.ts`; see [audio notes](docs/AUDIO.md). No audio files, streaming service, microphone, or network synthesis is used.

## Static hosting preparation

`astro.config.mjs` uses `output: 'static'`, directory-style routes, and `site: 'https://cognis11.xyz'`. That URL supplies canonical and social metadata; it does not configure the domain. `sitemap.xml` and `robots.txt` are rendered at build time without extra integrations.

Custom-domain hosting uses `/` by default. A GitHub project-path preview can be built and checked without source edits:

```sh
ASTRO_BASE_PATH=/foundation-review ASTRO_TELEMETRY_DISABLED=1 npm run build
ASTRO_BASE_PATH=/foundation-review CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e
```

Use the real repository path in place of `/foundation-review` when appropriate. Restore the intended custom-domain output afterward with `npm run build` without `ASTRO_BASE_PATH`.

The existing Cloudflare app is `tiny-scene-763b`, with root and `www` attached through its Domains tab. Publication is a separate authenticated operation; GitHub Actions validates source without deploying. The site requires neither a server application nor an Astro adapter. Existing DNS and email configuration are managed separately.

To build and prepare a dashboard upload archive:

```sh
ASTRO_TELEMETRY_DISABLED=1 npm run package
```

This requires Python 3 for packaging only. It rebuilds `dist/`, verifies ZIP integrity, and writes `release/cognis11-cloudflare.zip` with `index.html` at the archive root. It does not upload. `npm run build` alone does not refresh the ZIP. Generated output, local notes, credentials, and the pre-existing `.directory` file are ignored by Git. CLI deployment instructions are in [HOSTING.md](docs/HOSTING.md).

Reference documentation: [Astro installation requirements](https://docs.astro.build/en/install-and-setup/), [GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/), and [Astro CLI flags](https://docs.astro.build/en/reference/cli-reference/).

## Content boundary

The founder's approved public identity is **Guillaume Heinerth — Founder and Operator**, reachable at **founder@cognis11.xyz**. Proto-Pineal / UMBRA is named as the proprietary flagship; no private source, mechanisms, results, or research documents belong in this repository. Its public description is deliberately brief.

HOUND and Digital Bee Hive are supporting public experiments with links to their public evidence/design and explicit limits. Their original experiments were not rerun as website tests. Consulting scope and availability remain to be agreed for each inquiry; no pricing, clients, testimonials, credentials, or company history have been invented. No software or brand license is granted by merely making this repository public.
