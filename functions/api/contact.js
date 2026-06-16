/* POST /api/contact — contact form (nombre + email + mensaje).
   Body: { nombre, email, mensaje, empresa? }  (empresa = honeypot)

   Three steps:
   1. Upsert the person as a Brevo contact (NOMBRE/MENSAJE/SOURCE attributes). NO list add —
      this is a support enquiry; the newsletter opt-in is explicit, via the ack-email button.
   2. Notify the site owner (transactional email, reply-to = the visitor) — the critical path.
   3. Send the visitor an acknowledgement email (Brevo template = BREVO_CONTACT_TEMPLATE_ID)
      with a signed opt-in link (OPTIN_URL → /api/optin → /gracias). Best-effort.
   Success hinges on the owner notification, so an enquiry is never lost. See _lib.js for config. */
import { isEmail, escapeHtml, optinToken, json, readBody, brevo } from './_lib.js'

export async function onRequestPost({ request, env }) {
  const body = await readBody(request)
  if (body.empresa) return json({ ok: true }) // honeypot tripped

  const email = String(body.email || '').trim().toLowerCase()
  const nombre = String(body.nombre || '').trim()
  const mensaje = String(body.mensaje || '').trim()
  if (!isEmail(email)) return json({ ok: false, error: 'invalid_email' }, 400)
  if (!mensaje) return json({ ok: false, error: 'empty_message' }, 400)

  const apiKey = env.BREVO_API_KEY
  if (!apiKey) {
    console.log('[contact] Brevo not configured — simulating success for', email)
    return json({ ok: true, simulated: true })
  }

  const notifyTo = env.CONTACT_NOTIFY_EMAIL || 'hola@pum.mx'
  const senderEmail = env.BREVO_SENDER_EMAIL || 'hola@pum.mx'
  const senderName = env.BREVO_SENDER_NAME || '¡PUM!'

  // 1) Upsert contact — attributes only, NO list add (opt-in is explicit, via the ack email).
  const r1 = await brevo('/contacts', apiKey, {
    email,
    updateEnabled: true,
    attributes: { NOMBRE: nombre, MENSAJE: mensaje, SOURCE: 'contacto' },
  })
  if (!r1.ok && !(r1.status === 400 && r1.data && r1.data.code === 'duplicate_parameter')) {
    console.log('[contact] upsert warning', r1.status, JSON.stringify(r1.data))
  }

  // 2) Notify the owner — this is what success hinges on (don't lose the enquiry).
  const r2 = await brevo('/smtp/email', apiKey, {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: notifyTo }],
    replyTo: { email, name: nombre || email },
    subject: `Nuevo mensaje de contacto — ${nombre || email}`,
    htmlContent:
      `<h2 style="font-family:sans-serif">Nuevo mensaje desde pum.mx</h2>` +
      `<p><b>Nombre:</b> ${escapeHtml(nombre) || '—'}</p>` +
      `<p><b>Correo:</b> ${escapeHtml(email)}</p>` +
      `<p><b>Mensaje:</b></p><p>${escapeHtml(mensaje).replace(/\n/g, '<br>')}</p>`,
  })

  // 3) Acknowledge to the visitor + invite opt-in (best-effort; needs a template id).
  const ackTemplateId = parseInt(env.BREVO_CONTACT_TEMPLATE_ID, 10)
  if (ackTemplateId) {
    let origin = 'https://pum.mx'
    try { origin = new URL(request.url).origin } catch { /* keep default */ }
    const token = await optinToken(email, env.OPTIN_SECRET)
    const optinUrl = `${origin}/api/optin?e=${encodeURIComponent(email)}${token ? `&t=${token}` : ''}`
    const r3 = await brevo('/smtp/email', apiKey, {
      sender: { email: senderEmail, name: senderName },
      to: [{ email, name: nombre || undefined }],
      templateId: ackTemplateId,
      params: { NAME: nombre, MESSAGE: mensaje, OPTIN_URL: optinUrl },
    })
    if (!r3.ok) console.log('[contact] ack email error', r3.status, JSON.stringify(r3.data))
  }

  if (r2.ok) return json({ ok: true })
  console.log('[contact] notification error', r2.status, JSON.stringify(r2.data))
  return json({ ok: false }, 502)
}
