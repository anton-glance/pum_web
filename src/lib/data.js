/* Single import surface for all content (handoff doc 06 R1).
   Components never hardcode copy, prices, links, or asset paths.

   Content is imported from public/data/*.json at BUILD time (bundled into the JS).
   This was previously a runtime fetch + top-level await so dist/data/*.json could be
   edited live without a rebuild — but that made data.js an ASYNC module, and on iOS
   Safari the multi-chunk subpages hydrated before the shared chunk's await resolved,
   throwing a temporal-dead-zone error ("Cannot access 'cartStore' before initialization")
   into the ErrorBoundary. Synchronous build-time imports remove that race entirely; the
   site is pre-launch and ships through git → build → deploy anyway, so live JSON edits
   weren't part of the real workflow. (Edit the JSON, then `npm run build`.) */

import flavorsData from '../../public/data/flavors.json'
import siteData from '../../public/data/site.json'
import stringsData from '../../public/data/strings.json'
import pagesData from '../../public/data/pages.json'

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
