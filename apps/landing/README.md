# Landing page

The coming-soon page at https://wevenapp.com. Plain HTML styled with Tailwind, separate from the Expo app. No framework and no JavaScript. Design: `design/landing/ComingSoon.dc.html`.

- `public/index.html`: the page. All styling is Tailwind classes; no inline CSS (`factory/checks.sh` enforces this).
- `src/styles.css`: the Tailwind entry: fonts, page-only colours and animations. Shared colours and fonts come from `packages/theme/theme.css`.
- `public/styles.css`: built, not committed.

`main.yml` builds the CSS and deploys `public/` to the Cloudflare Pages project `weven-landing` on merges that change this folder or the theme.

Preview locally:

```
pnpm --filter landing dev
```

Fonts: Bricolage Grotesque and Inter (SIL Open Font License 1.1), latin subset, from Fontsource 5.3.0. They are hosted here so visitors' browsers don't contact Google.
