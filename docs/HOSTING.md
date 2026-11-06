# Current hosting

Verified November 5, 2026 (America/Montreal), after the Operator explicitly authorized publication of the polished update.

- Live: **https://cognis11.xyz/** and **https://www.cognis11.xyz/**
- Existing Cloudflare Workers Static Assets app: `tiny-scene-763b`.
- Public website source: **https://github.com/Cognis-11-Inc/cognis11-website**.
- Deployed version: **`1acd1cda-dc12-400d-9445-36b940f125eb`**.
- Previous version retained: `204063d8-d7ad-4512-bc02-ac20a012966d`.
- New bundle: 17 static files, including founder/contact content, public research evidence, social card, and synchronized ambient sound.

HTTPS checks returned **200** for all five main routes on both hostnames. New content and canonicals matched; root-page JS/CSS hashes and social-card bytes matched local output. Unknown routes returned the branded **404** with `noindex`. Desktop Chromium and Pixel 7 emulation exercised the deployed intro, instrument, navigation with persistent sound, and keyboard mute, with zero page exceptions and no horizontal overflow. This focused live check is separate from the full local suite.

No DNS, registrar, MX, SPF, or mail-routing change was needed. Contact uses a `mailto:` link; email delivery was not tested. Both domains serve directly with the root domain canonical. No hostname redirect was added.

## Updating the deployed site

Validate locally, then run `ASTRO_TELEMETRY_DISABLED=1 npm run package`. This restores root-domain output and regenerates the ignored `release/cognis11-cloudflare.zip`, with `index.html` at the archive root. The original ZIP is preserved as `release/cognis11-cloudflare-milestone001.zip`.

The current ZIP has 17 files, 126175 bytes, and SHA-256 `d9589c179164242953d196dc748ec7f75003de6d8d2ec704342fba7ef3916b47`. Repackaging may change ZIP timestamps and its checksum.

The authenticated CLI upload used an ignored `.local-notes/cloudflare-assets.jsonc`, matching the existing app's routing:

```json
{
  "name": "tiny-scene-763b",
  "compatibility_date": "2026-11-05",
  "keep_vars": true,
  "send_metrics": false,
  "preview_urls": false,
  "assets": {
    "directory": "../dist",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "404-page"
  }
}
```

The asset directory is relative to that file. Credentials/account selection stay outside source. With the intended account authenticated:

```sh
npx --yes wrangler@4.158.0 deploy --config .local-notes/cloudflare-assets.jsonc --no-autoconfig --dry-run
npx --yes wrangler@4.158.0 deploy --config .local-notes/cloudflare-assets.jsonc --no-autoconfig
```

No custom domains, routes, mail configuration, bindings, or secrets are declared by this asset upload. Domain associations remain dashboard-managed. The CLI initially defaulted deployment preview URLs on; explicit `preview_urls: false` and a trigger-only deployment restored the dashboard preference. The normal public `workers.dev` URL remains enabled.

GitHub Actions validates and builds source without deploying. A future publication remains a separate authenticated operation. No Astro server adapter or contact backend is required. Dashboard ZIP upload through **New deployment** remains available.

## Cloudflare agent setup

The requested [setup prompt](https://developers.cloudflare.com/agent-setup/prompt.md) and [Codex instructions](https://developers.cloudflare.com/agent-setup/codex/) were fetched and followed. Nineteen Cloudflare agent skills were installed globally for Codex. The server at `https://mcp.cloudflare.com/mcp` was registered; its OAuth login succeeded. Wrangler authentication also succeeded, with encrypted/keyring-backed credentials outside the repository.

The running session published with the authenticated CLI. Restart Codex to load the newly configured MCP tools. No token was added to source or requested in chat. The optional beta `cf` CLI was not installed.

References: [static assets](https://developers.cloudflare.com/workers/static-assets/get-started/), [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/workers/). See [Milestone 002](./MILESTONE-002.md) for current validation and the source tree.

## Historical record: initial dashboard connection

The following records the initial connection before the subsequent authorized CLI deployment and public repository. Its statements about absent authentication, repository, or CI describe that earlier point in time.

The first milestone was prepared locally. The Operator later uploaded the prepared static bundle through the Cloudflare dashboard and attached the primary domain. The resulting app uses **Cloudflare Workers Static Assets**, rather than a Pages project. The screenshot confirms an assets-only Worker; no server application is required.

- Primary public URL: **https://cognis11.xyz/**
- Additional public hostname: **https://www.cognis11.xyz/**
- Cloudflare app name: `tiny-scene-763b`
- Temporary app URL: `https://tiny-scene-763b.heinerth-guillaume.workers.dev/`
- Astro output directory: `dist/`
- Prepared upload: `release/cognis11-cloudflare.zip` (ignored generated artifact)
- Domain registrar: Porkbun; authoritative DNS: Cloudflare.

## Observed verification

Public HTTPS GETs returned **200** for Home, Research, About, Consulting, and Contact. The homepage matched the revised Cognis 11 title and opening question. The deployed CSS files, candidate corporate SVG mark, and favicon also returned **200**. Certificate verification was enabled in the HTTPS client.

The temporary app URL also served the expected Home, Research, and About pages. The first programmatic request was rejected with 403; retrying with a browser User-Agent returned the expected content. This does not establish any broader bot policy.

The root domain resolved through Cloudflare. The MX records and SPF TXT record matched those observed before the website domain was attached. Email delivery itself was not tested.

The Operator subsequently attached `www.cognis11.xyz` as a subdomain of the same zone. Follow-up public DNS and HTTPS checks confirmed that both hostnames resolve and return the expected homepage with HTTP 200. Both pages declare `https://cognis11.xyz/` as their canonical URL. The `www` hostname currently serves the site directly; no HTTP redirect to the primary hostname was observed or configured.

These are public HTTP/DNS checks. The earlier local browser suite passed 28 checks at both root and project-path configurations. That suite has not been rerun against the public domain, and no hosted-CI result is claimed.

## Manual updates

1. Make and validate the source change locally.
2. Run `ASTRO_TELEMETRY_DISABLED=1 npm run build` with the default root base path.
3. Regenerate the upload archive from the **contents** of `dist/`, so `index.html` is at its root. The existing ZIP is a snapshot and is not automatically updated by a build.
4. In Cloudflare, open Workers & Pages, select `tiny-scene-763b`, and use **New deployment** to upload the new static assets.
5. Verify the public primary domain and relevant routes after deployment.

The app’s current dashboard exposes domain connections in the **top Domains tab**, between Issues and Access. This differs from the Settings path in some Cloudflare documentation. Do not confuse that tab with the account-level Domains sidebar used for registrations and transfers.

No GitHub publishing workflow, new package, server adapter, analytics integration, or email change was added during this connection. Future autonomous deployment still requires an authenticated service connection and appropriate user authorization; account credentials were not requested or stored.
