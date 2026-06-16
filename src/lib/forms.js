/* Thin form adapter (handoff doc 06 R9, design-critique H6).
   Endpoints live in site.json → forms.{waitlistUrl,newsletterUrl,contactUrl} so the
   provider (Formspree, Buttondown, own API…) is swappable without touching components.
   Empty endpoint = pre-launch simulation: resolve success locally.
   `empresa` is the honeypot field — bots that fill it get a silent fake success. */
import { SITE } from './data.js'

/* Endpoint resolution order: build-time env (VITE_WAITLIST_URL / VITE_NEWSLETTER_URL /
   VITE_CONTACT_URL) → site.json forms.* → '' (empty = pre-launch simulate). This lets the
   owner connect a provider (Formspree, Buttondown, Mailchimp, own API…) by setting one env
   var at build/deploy time without editing committed data. */
const ENV = (typeof import.meta !== 'undefined' && import.meta.env) || {}
const ENDPOINTS = {
  waitlist: () => ENV.VITE_WAITLIST_URL || SITE.forms?.waitlistUrl || '',
  newsletter: () => ENV.VITE_NEWSLETTER_URL || SITE.forms?.newsletterUrl || '',
  contact: () => ENV.VITE_CONTACT_URL || SITE.forms?.contactUrl || '',
}

export async function submitForm(kind, fields) {
  if (fields.empresa) return { ok: true } // honeypot tripped — pretend success, drop data
  const url = ENDPOINTS[kind]?.() || ''
  if (!url) return { ok: true } // no provider configured yet (pre-launch)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      // `source` lets Brevo tag where the signup came from (newsletter vs waitlist vs contact).
      body: JSON.stringify({ ...fields, source: kind, empresa: undefined }),
    })
    return { ok: res.ok }
  } catch {
    return { ok: false }
  }
}

/* Double opt-in flow: after a successful email-capture submit we send the visitor to the
   "revisa tu correo" thank-you page (/gracias). Brevo then redirects them to /confirmacion
   once they click the confirmation link. Guarded for SSR/prerender (no window). */
export function goToThanks() {
  if (typeof window !== 'undefined') window.location.assign('/gracias')
}

/* Visually hidden honeypot input props — shared by all three forms. */
export const honeypotProps = {
  name: 'empresa',
  tabIndex: -1,
  autoComplete: 'off',
  'aria-hidden': 'true',
  style: { position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0, pointerEvents: 'none' },
}
