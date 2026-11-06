# Implementation Order 001 — Foundation

Review date: November 5, 2026 (America/Toronto).

Historical record. See [Milestone 002](./MILESTONE-002.md) and [Hosting](./HOSTING.md) for subsequent authorized content, audio, GitHub publication, and deployment work.

This document records the initial delivery. Its visual direction was superseded after Operator review by [Design Revision 001](./DESIGN-REVISION-001.md), which follows the existing Cognis 11 corporate identity and adds native interactions. The original results below describe the first pass; current validation is recorded in the revision document.

## Delivered

An Astro 7 / strict TypeScript static site with custom responsive CSS. The homepage uses a graphite background, pale green accents, system typography, an original paired-field SVG illustration, and an original provisional wordmark/favicon. It introduces the supplied company identity and four research directions without asserting research results.

Home, Research, Consulting, About, and Contact share navigation, a semantic main landmark, a keyboard skip link, and a footer. Navigation remains fully visible on mobile and needs no JavaScript. The secondary routes are deliberately bounded foundations with explicit content notices. A static 404 page, canonical URLs, descriptions, Open Graph/Twitter metadata, sitemap, robots file, and `.nojekyll` are included.

The approximately 3.66-second `BootSequence.astro` presents the five requested lines, then fades into Home. It supports skip, Enter, Escape, native modal focus, focus restoration, once-per-tab-session storage, reduced motion, and graceful storage/JavaScript fallbacks. Its timing is self-contained. Both the introduction and illustration state that the pairing is symbolic and no live connection exists.

The project has one production dependency (Astro) and five development dependencies for type checking and browser/accessibility verification. No analytics, tracking, external fonts, or third-party page requests are included. No server runtime is needed for the built files.

## Executed verification

| Exact command | Observed result |
| --- | --- |
| `npm install --no-audit --no-fund` | Succeeded; run initially and again after adding Node development types. |
| `ASTRO_TELEMETRY_DISABLED=1 npm run check` | Initial run failed: four missing Node `process` type errors in the test configuration and one anchor `href` type error in the tests. Added `@types/node` and an explicit anchor type. Rerun succeeded: 0 errors, 0 warnings, 0 hints. |
| `ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded; generated five requested pages, 404, sitemap, robots, local stylesheet, favicon, and `.nojekyll`. Run again at the end to restore root-domain output after project-path testing. |
| `CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | Initial run failed before executing tests because Astro backgrounded the preview process. Added `--ignore-lock` to Playwright’s preview command and stopped that owned background process. Rerun succeeded: 24/24 checks, 14.0 seconds. |
| `ASTRO_BASE_PATH=/foundation-review ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded; generated the same site for a GitHub project subpath. |
| `ASTRO_BASE_PATH=/foundation-review CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | Succeeded: 24/24 checks, 14.5 seconds, including prefixed links, stylesheet, metadata, fragments, and SEO files. |

The browser suite ran in local Chromium 156.0.8078.79 with desktop (1440 × 1000 CSS pixels) and Pixel 7 mobile emulation. Homepage screenshots from both projects were visually inspected. Tests also checked horizontal overflow at 320, 375, 768, 1024, and 1920 CSS pixels. Axe-core reported zero violations for its WCAG A/AA rules on the five routes and introductory dialog in both configurations. Browser checks also verified offline intro playback after load, no-JavaScript navigation, no external requests, active links, local routes/fragments, and keyboard behavior.

The test runner emitted a harmless `NO_COLOR`/`FORCE_COLOR` environment warning. No application exception or failed request was reported by the suite.

A final local `python3` helper ran `git diff --no-index --check /dev/null <file>` against all 32 newly created source/documentation files and confirmed no whitespace diagnostics. Its first attempt returned failure because it treated Git’s expected exit code 1 for newly added content as an error; the corrected helper accepts that code when there are no diagnostics and succeeded. The same successful run confirmed the restored root-domain canonical, six HTML documents, `.nojekyll`, one inline intro script, and no JavaScript bundles. `ASTRO_TELEMETRY_DISABLED=1 npm run preview -- status` succeeded and confirmed no owned preview server remains running.

These results cover Chromium and mobile emulation. Firefox, Safari, physical mobile devices, and manual screen-reader use were not tested. GitHub-hosted builds and live domain behavior were not tested. Browser download, lint, and audit commands were not run; no lint or audit script is defined.

## Resulting source tree

```text
.
├── .directory                    # pre-existing; preserved
├── .gitignore
├── README.md
├── astro.config.mjs
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── docs/
│   └── MILESTONE-001.md
├── public/
│   ├── .nojekyll
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Arrow.astro
│   │   ├── BootSequence.astro
│   │   ├── ContentNotice.astro
│   │   ├── PageHeading.astro
│   │   ├── RelationDiagram.astro
│   │   ├── SiteFooter.astro
│   │   ├── SiteHeader.astro
│   │   └── Wordmark.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   ├── research.ts
│   │   └── site.ts
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
    └── foundation.spec.ts
```

Generated local directories, excluded from the source tree: `node_modules/`, `.astro/`, `dist/`, and `test-results/`. The last contains the browser screenshots. All listed source files except `.directory` were created for this milestone; no pre-existing file was modified. There was no Git repository on entry, so no repository diff, commit, remote, or push exists.

## Missing content and review decisions

| Area | Still needed |
| --- | --- |
| Identity and design | Review the proposed headline, editorial voice, graphite/green palette, system typography, provisional wordmark, and paired-field illustration. Confirm whether the default intro and its pacing should remain. |
| Research | Approved project descriptions, methods, publication information, and evidence before adding any results or achievements. The current research questions are proposed copy, not established findings. |
| Consulting | Confirmed service scope, engagement formats, and availability before presenting offerings. No prices, clients, or testimonials have been added. |
| About | Approved people/biography information and any company background intended for public release. No history or credentials have been invented. |
| Contact | An approved public address/channel. No email address was guessed, and there is no form or message submission. |
| Social sharing | An approved raster sharing image if image previews are desired; text metadata currently works without one. |
| Future publication | Repository ownership/path, Pages workflow, domain binding, and publication remain for a separately authorized implementation order. |

## Execution boundary

The site remains local and undeployed. No hosted Site was registered, no GitHub repository or workflow was created, and no DNS, domain, or email setting was touched. `cognis11.xyz` appears only as the intended site origin in generated metadata. The final `dist/` build uses the root-domain path `/`.
