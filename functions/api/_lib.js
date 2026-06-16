/* Shared helpers for the Brevo-backed Pages Functions (functions/api/*).
   Files prefixed with "_" are NOT routed by Cloudflare Pages — they're import-only.
   The Brevo API key and IDs come from environment bindings (Pages → Settings → Variables),
   never from the client bundle. See .env.example / README for the full list. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isEmail(s) {
  return typeof s === 'string' && EMAIL_RE.test(s.trim())
}

export function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/* Same-origin JSON response. The site posts/reads JSON, so no CORS headers are needed. */
export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  })
}

export async function readBody(request) {
  try { return (await request.json()) || {} } catch { return {} }
}

/* Thin Brevo REST client. Returns { ok, status, data } — never throws on HTTP errors. */
export async function brevo(path, apiKey, body, method = 'POST') {
  let res
  try {
    res = await fetch(`https://api.brevo.com/v3${path}`, {
      method,
      headers: { 'content-type': 'application/json', accept: 'application/json', 'api-key': apiKey },
      body: body == null ? undefined : JSON.stringify(body),
    })
  } catch (e) {
    return { ok: false, status: 0, data: { message: String(e) } }
  }
  let data = null
  try { data = await res.json() } catch { /* 201/204 may carry no body */ }
  return { ok: res.ok, status: res.status, data }
}
