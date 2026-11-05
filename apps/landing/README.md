# Landing page

The coming-soon page at https://wevenapp.com. Plain HTML and CSS with no build step and no dependencies, separate from the Expo app. Design: `design/landing/ComingSoon.dc.html`.

Everything in `public/` is published as is. `main.yml` deploys it to the Cloudflare Pages project `weven-landing` on merges that change this folder.

Preview locally:

```
npx serve apps/landing/public
```

Fonts: Bricolage Grotesque and Inter (SIL Open Font License 1.1), latin subset, from Fontsource 5.3.0. They are hosted here so visitors' browsers don't contact Google.
