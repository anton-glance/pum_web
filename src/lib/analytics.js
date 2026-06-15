/* Purchase-intent signal (handoff §3 + §5). The product isn't for sale; the cart / "Avísame"
   flow only captures email, but we still want add-to-cart and checkout-intent to be MEASURABLE.

   Cloudflare Web Analytics is cookieless and pageview-based, so this stays privacy-friendly:
   - always dispatches a `pum:intent` CustomEvent any tracker can listen to;
   - pushes to window.dataLayer if a tag manager is ever added;
   - only when a Cloudflare Web Analytics token is configured (site.json analytics.cloudflareToken)
     does it fire a non-blocking beacon to the virtual path /intencion-compra so the intent is
     countable in Cloudflare traffic — no beacon (and no 404 noise) until analytics is connected.
   No cookies are set; no consent banner required. */
import { SITE } from './data.js'

export function trackIntent(label) {
  if (typeof window === 'undefined') return
  try { window.dispatchEvent(new CustomEvent('pum:intent', { detail: { label } })) } catch { /* ignore */ }
  try { if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'intencion_compra', label }) } catch { /* ignore */ }
  try {
    const token = SITE.analytics && SITE.analytics.cloudflareToken
    if (token && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/intencion-compra?e=' + encodeURIComponent(label))
    }
  } catch { /* ignore */ }
}
