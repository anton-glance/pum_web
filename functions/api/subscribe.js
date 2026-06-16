/* POST /api/subscribe — newsletter + waitlist email capture (double opt-in).
   Body: { email, empresa?, source? }  (empresa = honeypot, source = 'newsletter'|'waitlist'|…)

   Uses Brevo's double opt-in flow: the contact is NOT added to the list until they click
   the confirmation link in the email Brevo sends. That click lands them on redirectionUrl
   (BREVO_DOI_REDIRECT_URL → https://pum.mx/gracias, the "ya eres del crunch" page). On submit
   the visitor is sent to /confirmacion ("revisa tu correo"). See _lib.js for env/config. */
import { isEmail, json, readBody, brevo } from './_lib.js'

export async function onRequestPost({ request, env }) {
  const body = await readBody(request)
  if (body.empresa) return json({ ok: true }) // honeypot tripped — fake success, drop data

  const email = String(body.email || '').trim().toLowerCase()
  if (!isEmail(email)) return json({ ok: false, error: 'invalid_email' }, 400)

  const apiKey = env.BREVO_API_KEY
  const listId = parseInt(env.BREVO_LIST_ID, 10)
  const templateId = parseInt(env.BREVO_DOI_TEMPLATE_ID, 10)
  // Where Brevo sends the user after they click the opt-in link. Defaults to THIS deployment's
  // own origin + /gracias, so a preview deploy confirms to the preview's /gracias and prod to
  // pum.mx — no per-environment config needed. Override with BREVO_DOI_REDIRECT_URL for a fixed target.
  let origin = 'https://pum.mx'
  try { origin = new URL(request.url).origin } catch { /* keep default */ }
  const redirectionUrl = env.BREVO_DOI_REDIRECT_URL || `${origin}/gracias`

  // Not configured yet (pre-launch, before the owner pastes secrets): simulate success so the
  // form keeps working. Mirrors the project's "empty endpoint = simulate" convention.
  if (!apiKey || !listId || !templateId) {
    console.log('[subscribe] Brevo not configured — simulating success for', email)
    return json({ ok: true, simulated: true })
  }

  const attributes = {}
  if (body.source) attributes.SOURCE = String(body.source)

  const r = await brevo('/contacts/doubleOptinConfirmation', apiKey, {
    email,
    includeListIds: [listId],
    templateId,
    redirectionUrl,
    attributes,
  })

  if (r.ok) return json({ ok: true }) // 201 — DOI email sent

  // Already a contact (often = already confirmed): idempotent from the visitor's POV.
  if (r.status === 400 && r.data && r.data.code === 'duplicate_parameter') {
    return json({ ok: true, duplicate: true })
  }

  console.log('[subscribe] Brevo error', r.status, JSON.stringify(r.data))
  return json({ ok: false }, 502)
}
/* Non-POST methods get an automatic 405 from Pages (only onRequestPost is exported). */
