# Landing page

The coming-soon page at https://wevenapp.com. Plain HTML styled with Tailwind, separate from the Expo app. No framework and no JavaScript build step. Design: `design/landing/ComingSoon.dc.html`.

- `public/index.html`: the page. `public/privacy.html`: the privacy notice, served at `/privacy`.
- `public/consent.js`: the only hand-written JavaScript. It sets Google Consent Mode to denied, runs the cookie banner and loads Google Analytics (GA4 `G-WWBMDVC8E3`) only after the visitor accepts statistics.
- `public/vendor/cookieconsent/`: CookieConsent v3.1.0 (`vanilla-cookieconsent`, MIT, licence included), copied unmodified from npm. ESLint and Prettier skip it. The banner colours are the `#cc-main` overrides in `src/styles.css`.
- Both pages: all styling is Tailwind classes; no inline CSS (`factory/checks.sh` enforces this).
- `src/styles.css`: the Tailwind entry: fonts, page-only colours and animations. Shared colours and fonts come from `packages/theme/theme.css`.
- `public/styles.css`: built, not committed.

`main.yml` builds the CSS and deploys `public/` to the Cloudflare Pages project `weven-landing` on merges that change this folder or the theme. Same-repo PRs that change this folder or the theme get a preview at `https://pr-<n>.weven-landing.pages.dev` through `landing-preview.yml`.

Preview locally:

```
pnpm --filter landing dev
```

Fonts: Bricolage Grotesque and Inter (SIL Open Font License 1.1), latin subset, from Fontsource 5.3.0. They are hosted here, so fonts need no request to Google. Only Google Analytics contacts Google, and only after consent.

## Link preview

`public/og-image.png` is the 1200x630 Open Graph/Twitter image used by the tags in `index.html`. It copies the page's headline and logo, so it must be re-made when either one changes.

## Security headers

- The headers live in `public/_headers`, which Cloudflare Pages applies on deploy.
- The CSP allows same-origin scripts, styles, fonts and images. For Google Analytics (#18) it also allows scripts from `www.googletagmanager.com`, and connections and images to the Google Analytics and Tag Manager hosts. #15 (email form) will need to loosen it for its service.
- HSTS starts at `max-age=86400` with no `includeSubDomains` or `preload`. Raising it is a later follow-up, once every subdomain is known to serve HTTPS.
- Fonts are cached as immutable for a year, so a changed font file must get a new file name.
- SVGs in `public/` must not use inline `<style>` or `style` attributes, because the CSP blocks them.
