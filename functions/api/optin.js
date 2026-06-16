/* GET /api/optin?e=<email>&t=<token> — newsletter opt-in from the contact ack email button.
   The contact form does NOT subscribe anyone; this endpoint is the explicit opt-in: clicking
   the (signed) button link adds the person to the Brevo list and redirects them to /gracias
   ("¡ya eres del crunch!"). Single opt-in is appropriate here — the tokenized link was emailed
   to that address, so the click itself proves ownership + intent. See _lib.js for config. */
import { isEmail, optinToken, brevo } from './_lib.js'

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url)
  const email = String(url.searchParams.get('e') || '').trim().toLowerCase()
  const token = String(url.searchParams.get('t') || '')

  // Bad/forged links go home rather than to the "you're in" page.
  if (!isEmail(email)) return Response.redirect(`${url.origin}/`, 302)
  const secret = env.OPTIN_SECRET
  if (secret) {
    const expected = await optinToken(email, secret)
    if (!expected || token !== expected) {
      console.log('[optin] bad token for', email)
      return Response.redirect(`${url.origin}/`, 302)
    }
  }

  const apiKey = env.BREVO_API_KEY
  const listId = parseInt(env.BREVO_LIST_ID, 10)
  if (apiKey && listId) {
    const r = await brevo('/contacts', apiKey, {
      email,
      updateEnabled: true,
      listIds: [listId],
      attributes: { SOURCE: 'contacto-optin' },
    })
    if (!r.ok && !(r.status === 400 && r.data && r.data.code === 'duplicate_parameter')) {
      console.log('[optin] add-to-list error', r.status, JSON.stringify(r.data))
    }
  } else {
    console.log('[optin] Brevo not configured — skipping list add for', email)
  }

  return Response.redirect(`${url.origin}/gracias`, 302)
}
