# Landing page

The coming-soon page at https://wevenapp.com. Plain HTML styled with Tailwind, separate from the Expo app. No framework and no JavaScript. Design: `design/landing/ComingSoon.dc.html`.

- `public/index.html`: the page. All styling is Tailwind classes; no inline CSS (`factory/checks.sh` enforces this).
- `src/styles.css`: the Tailwind entry: fonts, page-only colours and animations. Shared colours and fonts come from `packages/theme/theme.css`.
- `public/styles.css`: built, not committed.

`main.yml` builds the CSS and deploys `public/` to the Cloudflare Pages project `weven-landing` on merges that change this folder or the theme. Same-repo PRs that change this folder or the theme get a preview at `https://pr-<n>.weven-landing.pages.dev` through `landing-preview.yml`.

Preview locally:

```
pnpm --filter landing dev
```

Fonts: Bricolage Grotesque and Inter (SIL Open Font License 1.1), latin subset, from Fontsource 5.3.0. They are hosted here so visitors' browsers don't contact Google.

## Security headers

- The headers live in `public/_headers`, which Cloudflare Pages applies on deploy.
- The CSP allows only same-origin styles, fonts and images. #15 (email form) and #18 (tracking) will need to loosen it for their services.
- HSTS starts at `max-age=86400` with no `includeSubDomains` or `preload`. Raising it is a later follow-up, once every subdomain is known to serve HTTPS.
- Fonts are cached as immutable for a year, so a changed font file must get a new file name.
- SVGs in `public/` must not use inline `<style>` or `style` attributes, because the CSP blocks them.
