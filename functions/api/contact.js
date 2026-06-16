/* POST /api/contact — contact form (nombre + email + mensaje).
   Body: { nombre, email, mensaje, empresa? }  (empresa = honeypot)

   Two best-effort steps:
   1. Upsert the person as a Brevo contact (NOMBRE/MENSAJE/SOURCE attributes). No double opt-in
      here — this is a support enquiry, not a marketing subscription.
   2. Email the message to the site owner as a transactional email (reply-to = the visitor).
   The owner notification is the action that decides success. See _lib.js for env/config. */
import { isEmail, escapeHtml, json, readBody, brevo } from './_lib.js'

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

  const listId = parseInt(env.BREVO_LIST_ID, 10)
  const notifyTo = env.CONTACT_NOTIFY_EMAIL || 'hola@pum.mx'
  const senderEmail = env.BREVO_SENDER_EMAIL || 'hola@pum.mx'
  const senderName = env.BREVO_SENDER_NAME || '¡PUM!'

  // 1) Upsert contact (non-fatal — never fail the visitor if this errors).
  const r1 = await brevo('/contacts', apiKey, {
    email,
    updateEnabled: true,
    attributes: { NOMBRE: nombre, MENSAJE: mensaje, SOURCE: 'contacto' },
    ...(listId ? { listIds: [listId] } : {}),
  })
  if (!r1.ok && !(r1.status === 400 && r1.data && r1.data.code === 'duplicate_parameter')) {
    console.log('[contact] upsert warning', r1.status, JSON.stringify(r1.data))
  }

  // 2) Notify the owner (this is what success hinges on).
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

  if (r2.ok) return json({ ok: true })
  console.log('[contact] notification error', r2.status, JSON.stringify(r2.data))
  return json({ ok: false }, 502)
}
