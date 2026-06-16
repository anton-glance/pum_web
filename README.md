# ¡PUM! — DTC marketing site

Production build of the approved Claude Design mockup (handoff bundle `pum-design-system`).
Vite + React 18, **prerendered to static HTML at build time** (SSG + hydration) so search and
AI crawlers — none of which execute JavaScript — see the full content. SEO/AISO hardened per
the June 2026 design-critique (structured data, sitemap, robots, OG, responsive AVIF/WebP images,
self-hosted fonts, WCAG AA contrast, focus-trapped dialogs, mobile menu).

## Run

```bash
npm install
npm run dev       # dev server → http://localhost:5173 (client-rendered, no prerender)
npm run build     # client build + SSR build + prerender + sitemap/robots → dist/
npm run preview   # serve dist/ (what crawlers and users get)
npm run images    # regenerate AVIF/WebP/PNG variants from assets-src/ (run after replacing artwork)
```

## Pages

| Path | What |
|---|---|
| `/index.html` | Homepage: hero, flavor grid, crunch game, Para Papás, footer + cart drawer, cart bar, product modal, coming-soon modal |
| `/sabores/{churro,chocolate,jamaica,limon}.html` | **Indexable product pages** with Product JSON-LD (PreOrder, MXN). In-site links to them open the shared modal in place; direct visits/crawlers get the full page |
| `/marca/{nosotros,ingredientes,contacto}.html` | Brand subpages (copy pending — `[bracketed]` placeholders + Borrador sticker) |
| `/legal/*.html` | 5 legal stubs — `noindex` until lawyer copy lands (remove the meta tag then) |
| `/404.html` | Branded not-found page (wire to your static host's 404 handling) |

Hash contracts (handoff doc 02): `#flavors|#crunch|#story` scroll −60 px below the header behind the
splash cover; `#sabor=<id>` opens that flavor's product modal on any page, in place, no navigation.

## SEO / AISO

- **Prerendered HTML**: `scripts/prerender.mjs` runs after the Vite builds and injects server-rendered
  markup + per-page head (title, description, canonical, OG/Twitter, JSON-LD) into `dist/*.html`,
  all computed from `public/data/*.json`. It also writes `dist/sitemap.xml` and `dist/robots.txt`
  (AI crawlers explicitly allowed).
- **Production origin** lives in `public/data/site.json → siteUrl` (currently `https://pum.mx`):
  one edit updates canonicals, OG, sitemap, robots, and JSON-LD on the next build.
- JSON-LD: `Organization` + `WebSite` (home), `Product` with `availability: PreOrder` +
  `BreadcrumbList` (sabores), `BreadcrumbList` (marca).
- `public/llms.txt`, `public/site.webmanifest`, `public/og-image.jpg` (generated 1200×630).
- Data edits (e.g. price) still apply at runtime without a rebuild — but crawlers read the
  prerendered HTML, so **rebuild after content edits** to keep what crawlers see in sync.

## Images

Originals live in `assets-src/` (drop a replacement with the same name). `npm run images`
generates AVIF + WebP + PNG fallback at multiple widths into `public/assets/` (packs went from
9–12 MB each to 8–40 KB AVIF). Components render them via the `PumImg` component (srcset/sizes,
explicit dimensions, lazy below the fold, `fetchpriority=high` on the hero).

## Forms → Brevo email engine

Every form (`src/lib/forms.js`) posts JSON to a first-party **Cloudflare Pages Function** that
talks to Brevo server-side — so the Brevo API key never reaches the browser. Endpoints are wired
in `site.json → forms`:

| Form (surface) | `kind` | Endpoint | Function | What it does |
|---|---|---|---|---|
| Footer newsletter (home) | `newsletter` | `/api/subscribe` | `functions/api/subscribe.js` | Brevo **double opt-in** → one list |
| ComingSoon modal · Notify cards | `waitlist` | `/api/subscribe` | same | same (tagged `SOURCE`) |
| Contacto form | `contact` | `/api/contact` | `functions/api/contact.js` | Upsert contact + email the message to the owner |

Flow: submit an email → redirect to **`/gracias`** ("revisa tu correo") → Brevo sends the opt-in
email → clicking it confirms and lands the user on **`/confirmacion`** (Brevo `redirectionUrl`).
The contact form stays inline (it's a support message, not a subscription). All forms carry a
honeypot (`empresa`); the Functions also validate the email and silently drop honeypot hits.

**Config (Cloudflare → Pages → pum-snacks → Settings → Variables & Secrets)** — see
[`.env.example`](.env.example) for the full list. Required: `BREVO_API_KEY` (secret),
`BREVO_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`. Optional: `BREVO_DOI_REDIRECT_URL`
(default `https://pum.mx/confirmacion`), `CONTACT_NOTIFY_EMAIL`, `BREVO_SENDER_EMAIL/NAME`.
Until the key + IDs are set the Functions **simulate success** so the forms keep working pre-launch.

Test the Functions locally against the built site: `npm run build && npx wrangler pages dev dist`.

**Before going live: set the Brevo vars and replace the Aviso de Privacidad stub — collecting
emails requires a real privacy notice under LFPDPPP.**

## Mobile (handoff doc 09 — implemented)

Built per `09-mobile-responsive-implementation.md` + the approved mobile mockup (`mobile/*.jsx`):

- **Device-tilt motion engine** (`src/lib/motion.jsx`, ported 1:1 from `mobile/tilt.jsx`):
  `PUM_TILT` sources gyro → touch-drag → mouse, one shared rAF tick, gravity vector for the
  googly eyes (they roll toward the ground), `Parallax` + `PackTilt` helpers,
  reduced-motion amplitude damping, `PUM_TILT.step()` manual tick for tests.
- **iOS 13+ permission prompt** (`MotionPermission.jsx`) — corn pill, approved copy
  "¿Me dejas sentir el crunch?"; touch-drag fallback keeps the page alive if denied.
- **Mobile hero ≤720 px** (locked): no category pill, centered copy, CTAs below the pack,
  tagline last; monsters move ONLY with tilt/drag at the approved offsets
  (pink mid-left, purple upper-right, green lower-right); pack tilts both directions
  symmetrically (no resting Y bias).
- **Menu sheet** ≤820 px: right slide-in with section + marca + legal links and the CTA;
  scrim/Esc close, scroll lock, ≥44 px targets.
- **Product modal ≤680 px**: full-screen sheet (tilt-driven image panel, scrollable info,
  sticky add-bar); not-in-cart button label is the short, approved "Agregar {n}"
  (`strings.json → modal.addToCartShort`).
- **Cart ≤680 px**: bottom-sheet (26 px top radius) with the parental notice; CartBar and
  sheets clear the home-indicator via safe-area insets. Desktop keeps the side drawer.
- Desktop is regression-free: cursor still drives eyes (sim source), pack tilts on hover,
  mascot follows, crumb trail works (suppressed on touch).

### One responsive tree (mobile + desktop together)

There is a **single component tree**, width-branched at runtime via `useMediaQuery` (in
`src/lib/motion.jsx`) at the design-system breakpoint (≤720px = phone layout). Every section
(Nav, Hero, FlavorCard/grid, CrunchZone, Story, Footer, ProductModal, Cart, ComingSoon, subpages,
legal) carries mobile metrics matched to the approved mobile mockup (`mobile/*.jsx`) — verified by
probing computed styles of the mockup and the build side by side (hero H1 43px/centered, pack 230px,
flavor grid 1-col gap 24, card image 172px, crunch 480px min / bag 170px, story 2×2 benefits, footer
stacked 2-col, etc.). `useMediaQuery` resolves in a **layout effect** (pre-paint), so a phone loading
the prerendered (desktop) HTML swaps to the mobile layout before first paint — no flash, no hydration
mismatch. Verified at 360 / 390 / 402 / 430 / 768 / 1280 px with no horizontal scroll and desktop
fully intact.

## Content management (handoff doc 06)

**No copy, price, link, or asset path lives in a component.** Edit only:

- `public/data/flavors.json` — products: names, blurbs, prices, colors, ratings, nutrition, pack images, game params
- `public/data/site.json` — nav, footer, contact, links registry, logos, feature flags (`checkoutEnabled` is OFF: every "Ir a pagar" opens the coming-soon email capture)
- `public/data/strings.json` — every fixed UI string (es-MX)
- `public/data/pages.json` — long-form marca page copy + legal page titles
- `public/assets/` — artwork; replacing a file with the same name swaps it sitewide
  (`logos/`, `packs/pack-<flavorId>.png`, `puffs/`, `brand/`)
- `public/colors_and_type.css` — canonical design tokens (kept verbatim from the design system)

Adding a 5th flavor = add an object to `flavors.json` + drop `pack-<id>.png`. Grid, modal, footer,
game cycle, and cart pick it up automatically.

**No rebuild needed to change content.** The `public/data/*.json` files are served as static
assets and fetched at runtime (see `src/lib/data.js`, top-level await). On a deployed site, edit
`dist/data/flavors.json` (e.g. a price) and reload — the change shows immediately, no `npm run build`.

Cart contract: `localStorage["pum_cart"]` = `{"<flavorId>": qty}` — shared across all pages
(`src/lib/cart.js` is the single owner).

## Source map

- `src/main.jsx` — homepage entry (state, hash routing, splash sequencing)
- `src/subpage.jsx` — marca page entry (shared chrome + in-place `#sabor=` modal interception)
- `src/components/` — `Nav`, `Footer`, `ProductModal` (ONE component, every entry point), `Cart` (drawer/bar/coming-soon), `home` (Hero/Flavors/CrunchZone/Story), `subpages`, `ui` (Btn/Icon/Rating)
- `src/lib/` — `data.js` (single import surface over `/data`), `cart.js`, `fx.jsx` (crumb particles, googly monsters, cursor mascot)

## Compliance notes (handoff docs 05/07)

- Never use "horneado no frito" / "no frito" or health claims; "30 g" never "30 gr".
- "carrito" = the cart; "bolsa" = a bag of product. Don't mix.
- No real checkout: production launch = flip `features.checkoutEnabled` in `data/site.json` and implement payment behind the existing "Ir a pagar" actions; nothing else changes.
- Forms (waitlist, newsletter, contact) are front-end success states — wire to a provider behind one small API module when ready.
