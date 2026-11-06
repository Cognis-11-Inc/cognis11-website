# Milestone 002 — An authored research presence

Historical delivery. [Milestone 003](./MILESTONE-003.md) extends the score/discoveries and publishes the subsequently confirmed consulting offer. Its terms supersede the open pricing decisions below.

November 5, 2026. Follow-up work explicitly authorized by the Operator: publish the founder and contact channel, show bounded public research evidence, keep the flagship private, create a public company GitHub repository, add subtle synchronized sound, and deploy the polished site.

## Delivered

- Approved founder: **Guillaume Heinerth — Founder and Operator**. His introduction reflects pattern seeking, mechanisms, making real things, creative contradiction, and an ambition to awaken curiosity. The company invites intellectual challenge and active investigation.
- Direct **founder@cognis11.xyz** mailto contact, also available in the shared footer.
- **Proto-Pineal / UMBRA** placed first as the proprietary flagship. Only a brief public thesis is included; private mechanisms, code, experiments, and documents remain outside the website and its public repository.
- HOUND and Digital Bee Hive shown as supporting public projects, with public source links, evidence/design attribution, and limits. HOUND's dated verification is reported as a documented experiment, not a test rerun for this website.
- Consulting invites a specific problem or assumption worth examining. Scope, availability, packages, and pricing remain undefined.
- Original dark ambient synthesis, related interaction cues, and restrained visual modulation on a common 66 BPM clock. A 111 Hz root and stereo 11 Hz difference are compositional settings. Visitors get one Enable / Mute / Unmute control.
- Sound persists through client navigation. First activation requires a gesture; hidden tabs suspend audio. Reduced motion suppresses visual modulation. Native disclosures/navigation still work without JavaScript.
- Local 1200 × 630 social card using the existing corporate mark and colour direction.
- Public website repository under **Cognis-11-Inc**, pinned dependencies, validation workflow, and repeatable build/ZIP packaging. No deployment credentials or private research are included.
- Deployment to the existing Cloudflare assets app, verified on both public hostnames. [Hosting](./HOSTING.md) records the deployed version, archive, and public checks.

The previous homepage/instrument, house palette, corporate vector, and foundation were preserved and extended. Historical delivery records remain available. The old upload archive and original local review notes were preserved outside version control.

## Executed validation

| Exact command | Observed result |
| --- | --- |
| `ASTRO_TELEMETRY_DISABLED=1 npm run check` | Initially failed on a possibly undefined audio timestamp, with one unused-scheduler hint. Corrected the guard and removed the unused field. Final run succeeded: **0 errors, 0 warnings, 0 hints**. |
| `ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded; six static HTML pages plus local assets and SEO files. Repeated after implementation changes. |
| `CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | First audio-expanded run failed two tests because the assertion expected float64 identity from a float32 AudioParam. Changed to a timing tolerance. Final run after simplifying sound controls succeeded: **34/34**, 19.3 seconds. |
| `ASTRO_BASE_PATH=/foundation-review ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded with final content and audio. |
| `ASTRO_BASE_PATH=/foundation-review CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | Succeeded: **34/34**, 19.3 seconds. |
| `ASTRO_TELEMETRY_DISABLED=1 npm run package` | Succeeded; rebuilt at `/`, generated the 17-file ZIP, checked CRC integrity and root `index.html`, and printed its SHA-256. Does not deploy. |
| `npx --yes wrangler@4.158.0 deploy --config .local-notes/cloudflare-assets.jsonc --no-autoconfig --dry-run` | Succeeded for the intended existing app. |
| `npx --yes wrangler@4.158.0 deploy --config .local-notes/cloudflare-assets.jsonc --no-autoconfig --message 'Cognis 11: founder, public research, contact, and synchronized ambient sound'` | Succeeded: 17 assets uploaded; version in Hosting. The verified account was selected through the command environment. |
| `npx --yes wrangler@4.158.0 triggers deploy --config .local-notes/cloudflare-assets.jsonc` | Restored explicit preview-URL configuration separately from the asset upload. |

The harmless Playwright `NO_COLOR` / `FORCE_COLOR` environment warning remains. Wrangler initially warned that absent preview settings enable deployment previews; explicit configuration subsequently restored the dashboard preference. Wrangler marks the trigger-only command experimental.

The 34 local checks span desktop Chromium and Pixel 7 emulation: foundation behavior, accessibility rules assessed by axe, links/metadata, no third-party asset requests, 320–1920px overflow, real Web Audio graph/output, stereo/tempo settings, keyboard mute/resume, one context across navigation, intro sound activation, and reduced motion. A measured nonzero output signal establishes browser synthesis, without replacing listening review.

A separate inline Python HTTPS check verified all five routes on both live domains, canonicals, deployed JS/CSS hashes, social-card bytes, and branded 404 status/content. A separate inline Playwright smoke check exercised the deployed intro, instrument, persistent sound, About navigation, keyboard mute, overflow, and page exceptions on desktop/mobile emulation. Both live runs succeeded. Homepage, About, Contact, Research, open-instrument, and social-card images were visually reviewed across the work.

Git's cached whitespace/path gates and remote-ref verification are used for publication. Hosted results are available in [GitHub Actions](https://github.com/Cognis-11-Inc/cognis11-website/actions), distinct from the local browser suite.

## Files and resulting source tree

This is the checkout's first Git snapshot, so all website source files are added together. The foundation was already present locally. New functionality centres on `AudioControls.astro`, `sound.ts`, `ResearchArtifact.astro`, `artifacts.ts`, `audio.spec.ts`, the social card, packaging script, and workflow. Content, layout, footer, instrument initialization, and documentation integrate them.

```text
.
├── .github/workflows/check.yml
├── .gitignore
├── README.md
├── astro.config.mjs
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── docs/
│   ├── AUDIO.md
│   ├── DESIGN-REVISION-001.md
│   ├── HOSTING.md
│   ├── MILESTONE-001.md
│   └── MILESTONE-002.md
├── public/
│   ├── .nojekyll
│   ├── brand/cognis11-mark-v0.2.svg
│   ├── favicon.svg
│   ├── social-card.png
│   └── social-card.svg
├── scripts/package_site.py
├── src/
│   ├── components/
│   │   ├── Arrow.astro
│   │   ├── AudioControls.astro
│   │   ├── BootSequence.astro
│   │   ├── ContactInstrument.astro
│   │   ├── ContentNotice.astro
│   │   ├── PageHeading.astro
│   │   ├── ResearchArtifact.astro
│   │   ├── SiteFooter.astro
│   │   ├── SiteHeader.astro
│   │   └── Wordmark.astro
│   ├── layouts/BaseLayout.astro
│   ├── lib/
│   │   ├── artifacts.ts
│   │   ├── research.ts
│   │   ├── site.ts
│   │   └── sound.ts
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── consulting.astro
│   │   ├── contact.astro
│   │   ├── index.astro
│   │   ├── research.astro
│   │   ├── robots.txt.ts
│   │   └── sitemap.xml.ts
│   └── styles/
│       ├── global.css
│       └── pages.css
└── tests/
    ├── audio.spec.ts
    └── foundation.spec.ts
```

Output, dependencies, screenshots, local notes, deployment settings, credentials, and the preserved `.directory` are excluded from the public snapshot.

## Still open

- The Operator's listening review: level, voicing, spectral balance, stereo effect, and physical audiovisual timing. The theme is centralized for adjustment.
- Final approval of corporate mark, calibrated colour values, and typography; the existing house direction remains in use.
- Consulting services, engagement process, availability, and pricing.
- Any further founder biography/company information expressly intended for publication.
- An approved public release plan for the proprietary flagship. Its underlying work remains private.
- Physical devices, Safari/Firefox, manual screen-reader use, and mail delivery were not tested. The full local suite was not rerun against production; focused public checks are described separately.
