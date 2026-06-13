/* Single import surface for all content (handoff doc 06 R1).
   Components never hardcode copy, prices, links, or asset paths.

   Data is fetched at RUNTIME from /data/*.json (served statically from public/data),
   not bundled at build time. This means prices, copy, links and other content can be
   edited on the deployed server by editing dist/data/*.json — no rebuild required
   (handoff doc 06 R2/R5; resolves issue: "change prices without site re-build").

   The top-level await below blocks the entry module until content is loaded, so every
   component still imports SITE / FLAVORS / STRINGS synchronously and sees final values
   on first render (no price flash). Requires build target es2022+ (set in vite.config.js). */

const BASE = import.meta.env.BASE_URL || '/'

async function loadJSON(name) {
  if (import.meta.env.SSR) {
    // Prerender (node, run from the project root): read the same files from public/data
    const { readFile } = await import('node:fs/promises')
    const { join } = await import('node:path')
    return JSON.parse(await readFile(join(process.cwd(), 'public/data', `${name}.json`), 'utf8'))
  }
  const res = await fetch(`${BASE}data/${name}.json`, { cache: 'no-cache' })
  if (!res.ok) throw new Error(`Failed to load data/${name}.json (${res.status})`)
  return res.json()
}

const [flavorsData, siteData, stringsData, pagesData] = await Promise.all([
  loadJSON('flavors'),
  loadJSON('site'),
  loadJSON('strings'),
  loadJSON('pages'),
])

export const SITE = siteData
export const STRINGS = stringsData
export const PAGES = pagesData
export const NUTRITION = flavorsData.nutrition
export const GAME = flavorsData.crunchGame

/* Internal component shape, mapped once from the data file. */
export const FLAVORS = flavorsData.flavors.map((f) => ({
  id: f.id,
  name: f.name,
  es: f.subtitle,
  color: f.color,
  wash: f.wash,
  ink: f.ink,
  img: f.images.pack,
  price: f.priceMXN,
  crunch: f.ratings.intensidad,
  sweet: f.ratings.dulzura,
  tag: f.tag || undefined,
  blurb: f.blurb,
  monster: f.monsterLine,
  desc: f.description,
}))

export const LINKS = SITE.links
/* Pre-launch: no purchase. Cart/checkout UI is removed and every buy CTA becomes
   the waitlist signup (handoff v3 / T0.1). Flip to false at launch to restore commerce. */
export const WAITLIST = !!(SITE.features && SITE.features.waitlist)

/* One shared price formatter (doc 06 R2). */
export const fmtPrice = (n) => `$${n}`
export const fmtPriceMXN = (n) => `$${n} MXN`
