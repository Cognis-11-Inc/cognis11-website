# Milestone 003 — Bass, discoveries, and an independent practice

November 5, 2026, America/Toronto. The Operator requested rare low bass, revised snare/reverb, a longer musical arc, visual surprises/Easter eggs/rarity, and explicit consulting terms. The existing website, company identity, single sound control, private flagship boundary, and hosting are preserved.

## Delivered

- A 96-bar, 66 BPM score: about **5:49** before repetition, with 12 slow voicings, eleven bass events and fourteen sparse snare events. The first bass arrives about seven seconds after the transport starts. Bass has a soft attack, sub fundamental, and a quiet harmonic; the snare combines filtered noise and tuned body.
- A darker shared space: **38 ms predelay**, diffusion, early reflections, a **7.2-second stereo impulse**, low-end filtering, and high-frequency damping. Interaction/discovery cues use the same harmony and room. Musical settings remain compositional choices.
- A restrained bass response on the same output clock as the sound. Visitors retain one Enable / Mute / Unmute control; sound still requires a gesture and persists across route changes. Reduced motion suppresses visual modulation.
- Nine authored discovery fragments: ordinary configurations, rare eclipse/eleventh-door encounters, signal 11, a fifth research question, repetition, and a returning signal. The archive is optional tab-session state. Essential information is accessible normally; no private research is revealed. [Discovery notes](./DISCOVERIES.md) describe the rules and review paths.
- Consulting: **one free evaluation**, then **CAD $100/hour**, **up to three hours per week per client**, or a separately defined contract. AI assistance and human review are explicit. The weekly limit reserves lab time. Total client capacity remains undecided.
- After the free evaluation and agreement to paid work, documentation review is billable. Review, analysis, preparation, agreed execution, meetings, and client-requested interruptions during that work count toward the same cap. This describes consulting work, not an unattended wall-clock charge after an email arrives.
- A full local stereo listening WAV generated from the same synthesis functions used by the website. It is excluded from the website bundle and public repository.

No client count, free-evaluation duration, contract price, exclusivity premium, credentials, client results, or speed guarantee was invented. Initial inquiry guidance asks what a client is building, what blocks them, what they tried, and what a useful result means. No booking/payment/form backend was added.

## Files

New source: `src/lib/score.ts`, `src/lib/discoveries.ts`, `src/components/DiscoveryField.astro`, `scripts/render_audio_preview.mjs`, `tests/discovery.spec.ts`, `tests/score.spec.ts`, and discovery/delivery documentation.

Updated: audio playback/controls, the paired instrument, homepage, Consulting and its responsive styles, package scripts, README, audio notes, and hosting/delivery records. Production dependencies are unchanged. The full previous tree is in Milestone 002; these new files extend its existing `src/`, `scripts/`, `tests/`, and `docs/` directories.

## Executed verification

| Exact command | Observed result |
| --- | --- |
| `ASTRO_TELEMETRY_DISABLED=1 npm run check` | Succeeded after implementation: 34 files, **0 errors, 0 warnings, 0 hints**. |
| `ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded, six HTML pages with local assets and SEO output. |
| `CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | Final root build: **46/46 passed**, 23.4 seconds. |
| `ASTRO_BASE_PATH=/foundation-review ASTRO_TELEMETRY_DISABLED=1 npm run build` | Succeeded, including final consulting/clock copy. |
| `ASTRO_BASE_PATH=/foundation-review CHROMIUM_PATH=/usr/bin/chromium ASTRO_TELEMETRY_DISABLED=1 npm run test:e2e` | **46/46 passed**, 23.3 seconds. |
| `CHROMIUM_PATH=/usr/bin/chromium npm run audio:render` | Succeeded; full stereo WAV generated through native OfflineAudioContext. RIFF format and stereo PCM16/24 kHz also verified with Python's `wave` module. |
| `ASTRO_TELEMETRY_DISABLED=1 npm run package` | Succeeded; restored `/`, verified ZIP integrity and root `index.html`, generated 17-file upload archive. |
| `npx --yes wrangler@4.158.0 deploy --config .local-notes/cloudflare-assets.jsonc --no-autoconfig --dry-run` | Succeeded for the existing app. |
| `npx --yes wrangler@4.158.0 deploy --config .local-notes/cloudflare-assets.jsonc --no-autoconfig --message 'Cognis 11: rare bass, long-form score, discoveries, and consulting terms'` | Succeeded; nine changed assets uploaded, eight reused. Verified account selected through command environment. Version in Hosting. |

All listed validation commands succeeded. The existing harmless Playwright `NO_COLOR` / `FORCE_COLOR` warning remains. Tests ran in desktop Chromium and Pixel 7 emulation; they include native offline DSP renders measuring bass energy at 55.5 Hz, stereo signal, peak headroom, and decaying snare reverb, plus discovery/cooldown/accessibility/session behavior and the consulting offer. Entropy alone is controlled for reproducing the rare state.

The full listening artifact is `release/cognis11-ambient-v2-preview.wav`, approximately 5:56 including the tail, 34,203,972 bytes, stereo PCM16 at 24 kHz. The latest render measured peak `0.0394207` and RMS `0.00388995`; SHA-256 `2159343e71ec0461cede3cc3717fd828dba13d855415417bfb745abf68ab5b01`. These are signal measurements, not a subjective listening certification or LUFS measurement. Browser DSP floating-point variation may change a rerender's file checksum.

Public HTTPS checks confirmed all five routes on both hostnames, canonicals, exact root-page JS/CSS bytes, new content, and branded 404 behavior. Separate live desktop/mobile smoke checks confirmed discoveries, scheduled bass-driven visual response, persistent audio, pricing/clock wording, mute/suspend, no overflow, and zero page exceptions. Live and local screenshots were reviewed. Hosting records the deployed version and archive checksum. GitHub's check/build workflow is separate from the local browser/DSP suite.

## Remaining decisions

The Operator's listening judgment, physical-device audiovisual timing, rare-encounter cadence, total weekly client count, free-evaluation scope/duration, and any contract/exclusivity terms remain open. Physical phones, Safari/Firefox, screen-reader use, and mail delivery were not tested. The underlying Proto-Pineal / UMBRA work remains private. No DNS or email configuration was changed.
