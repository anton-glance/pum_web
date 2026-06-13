/* Thin form adapter (handoff doc 06 R9, design-critique H6).
   Endpoints live in site.json → forms.{waitlistUrl,newsletterUrl,contactUrl} so the
   provider (Formspree, Buttondown, own API…) is swappable without touching components.
   Empty endpoint = pre-launch simulation: resolve success locally.
   `empresa` is the honeypot field — bots that fill it get a silent fake success. */
import { SITE } from './data.js'

const ENDPOINTS = {
  waitlist: () => SITE.forms?.waitlistUrl || '',
  newsletter: () => SITE.forms?.newsletterUrl || '',
  contact: () => SITE.forms?.contactUrl || '',
}

export async function submitForm(kind, fields) {
  if (fields.empresa) return { ok: true } // honeypot tripped — pretend success, drop data
  const url = ENDPOINTS[kind]?.() || ''
  if (!url) return { ok: true } // no provider configured yet (pre-launch)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...fields, empresa: undefined }),
    })
    return { ok: res.ok }
  } catch {
    return { ok: false }
  }
}

/* Visually hidden honeypot input props — shared by all three forms. */
export const honeypotProps = {
  name: 'empresa',
  tabIndex: -1,
  autoComplete: 'off',
  'aria-hidden': 'true',
  style: { position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0, pointerEvents: 'none' },
}
