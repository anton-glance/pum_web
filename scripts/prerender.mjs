/* Prerender (design-critique H1/H3/H4/H5/H7).
   Runs after `vite build` (client) + `vite build --ssr` (server bundle):
   1. server-renders every page and injects the markup into dist/*.html (#root),
   2. injects per-page head: title, description, canonical, Open Graph, Twitter, JSON-LD —
      all computed from public/data/*.json (single source of truth, doc 06 R1),
   3. writes dist/sitemap.xml and dist/robots.txt from site.json's siteUrl.
   Result: crawlers (AI crawlers execute no JS) see complete content; React hydrates on top. */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const DIST = join(ROOT, 'dist')

const { renderPage, FLAVORS, SITE, PAGES: CONTENT } = await import(new URL('../dist-ssr/entry-server.js', import.meta.url))

const ORIGIN = SITE.siteUrl.replace(/\/$/, '')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
/* Cloudflare Pages serves files at extensionless "clean" URLs (the .html form
   308-redirects to them). Canonical/OG/sitemap/JSON-LD therefore point at the clean
   URL the host actually returns 200 for — no redirect in the canonical chain. */
const clean = (u) => (u === '/' ? '/' : u.replace(/\.html$/, ''))

const ORG_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.brand.legalName,
  url: `${ORIGIN}/`,
  logo: `${ORIGIN}${SITE.logos.onLight}`,
  email: SITE.contact.email,
  telephone: SITE.contact.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av Alfonso Reyes 100, Zona Valle Poniente',
    addressLocality: 'Santa Catarina',
    addressRegion: 'Nuevo León',
    postalCode: '66196',
    addressCountry: 'MX',
  },
}
const WEBSITE_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.brand.name,
  alternateName: 'PUM Snacks',
  url: `${ORIGIN}/`,
  inLanguage: 'es-MX',
}
const breadcrumb = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(url ? { item: `${ORIGIN}${clean(url)}` } : {}) })),
})
/* FAQPage from the grouped verbatim Q&As; `sa` is the plain-text schema answer
   (the visible `a` carries inline-markdown links). */
const faqLD = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: CONTENT.faq.groups.flatMap((g) => g.items).map((it) => ({
    '@type': 'Question',
    name: it.q,
    acceptedAnswer: { '@type': 'Answer', text: it.sa || it.a },
  })),
})
/* ItemList of flavors (PUM_ClaudeDesign_build_prompt.md §SEO) — on Para Papás + Ingredientes. */
const FLAVOR_LIST = [
  ['Jamaica · Flor crujiente', 'jamaica'],
  ['Limón · Fresco y ácido', 'limon'],
  ['Chocolate · Cacao cremosito', 'chocolate'],
  ['Churro · Dulce y canelado', 'churro'],
]
const itemListLD = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: FLAVOR_LIST.map(([name, id], i) => ({ '@type': 'ListItem', position: i + 1, name, url: `${ORIGIN}/sabores/${id}` })),
})
const productLD = (f) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `¡PUM! ${f.name}`,
  description: f.desc,
  image: [`${ORIGIN}/assets/packs/pack-${f.id}.png`],
  brand: { '@type': 'Brand', name: SITE.brand.name },
  category: SITE.brand.category,
  sku: `PUM-${f.id.toUpperCase()}-30G`,
  weight: { '@type': 'QuantitativeValue', value: 30, unitCode: 'GRM' },
  offers: {
    '@type': 'Offer',
    url: `${ORIGIN}/sabores/${f.id}`,
    price: f.price,
    priceCurrency: SITE.commerce.currency,
    availability: 'https://schema.org/PreOrder',
    itemCondition: 'https://schema.org/NewCondition',
    seller: { '@type': 'Organization', name: SITE.brand.legalName },
  },
})

const PAGES = [
  {
    path: 'index.html',
    page: 'index',
    url: '/',
    title: `${SITE.brand.name} — ${SITE.brand.category} | ${SITE.brand.tagline}`,
    desc: '¡PUM! — palitos de maíz, ligeros y crujientes, con sabores dulces mexicanos. Producto en desarrollo: conoce las especificaciones objetivo y únete a la lista de espera.',
    ogType: 'website',
    ld: [ORG_LD, WEBSITE_LD],
  },
  {
    path: 'marca/nosotros.html',
    page: 'nosotros',
    url: '/marca/nosotros.html',
    title: CONTENT.nosotros.title,
    desc: CONTENT.nosotros.metaDescription,
    ogType: 'website',
    ld: [breadcrumb([['Inicio', '/'], ['Para Papás', '/marca/nosotros.html']]), itemListLD()],
  },
  {
    path: 'marca/ingredientes.html',
    page: 'ingredientes',
    url: '/marca/ingredientes.html',
    title: CONTENT.ingredientes.title,
    desc: CONTENT.ingredientes.metaDescription,
    ogType: 'website',
    ld: [breadcrumb([['Inicio', '/'], ['Ingredientes', '/marca/ingredientes.html']]), itemListLD()],
  },
  {
    path: 'marca/contacto.html',
    page: 'contacto',
    url: '/marca/contacto.html',
    title: CONTENT.contacto.title,
    desc: CONTENT.contacto.metaDescription,
    ogType: 'website',
    ld: [breadcrumb([['Inicio', '/'], ['Contacto', '/marca/contacto.html']])],
  },
  {
    path: 'preguntas-frecuentes.html',
    page: 'faq',
    url: '/preguntas-frecuentes.html',
    title: CONTENT.faq.title,
    desc: CONTENT.faq.metaDescription,
    ogType: 'website',
    ld: [faqLD(), breadcrumb([['Inicio', '/'], ['Preguntas frecuentes', '/preguntas-frecuentes.html']])],
  },
  {
    path: 'confirmacion.html',
    page: 'confirmacion',
    url: '/confirmacion.html',
    title: '¡PUM! — Revisa tu correo',
    desc: 'Te enviamos un enlace para confirmar tu suscripción a la lista de espera de ¡PUM!.',
    ogType: 'website',
    noindex: true,
    ld: [],
  },
  {
    path: 'gracias.html',
    page: 'gracias',
    url: '/gracias.html',
    title: '¡PUM! — ¡Listo, ya eres del crunch!',
    desc: 'Confirmaste tu correo: ya estás en la lista de espera de ¡PUM!.',
    ogType: 'website',
    noindex: true,
    ld: [],
  },
  ...FLAVORS.map((f) => ({
    path: `sabores/${f.id}.html`,
    page: 'sabor',
    flavorId: f.id,
    url: `/sabores/${f.id}.html`,
    title: `¡PUM! ${f.name} — ${SITE.brand.category}`,
    desc: `${f.desc} Producto en desarrollo; especificaciones objetivo. Únete a la lista de espera.`,
    ogType: 'product',
    ogImage: `/assets/packs/pack-${f.id}.png`,
    ld: [productLD(f), breadcrumb([['Inicio', '/'], ['Sabores', '/index.html#flavors'], [f.name, `/sabores/${f.id}.html`]])],
  })),
]

function headBlock(p) {
  const ogImage = `${ORIGIN}${p.ogImage || '/og-image.jpg'}`
  const canonical = `${ORIGIN}${clean(p.url)}`
  const lines = [
    `<meta name="description" content="${esc(p.desc)}">`,
    // Disable Chrome/Google auto-translation: it rewrites text nodes during React
    // hydration, causing hydration mismatches (#418/#425) that break interactivity.
    `<meta name="google" content="notranslate">`,
    ...(p.noindex ? [`<meta name="robots" content="noindex,follow">`] : []),
    `<link rel="canonical" href="${canonical}">`,
    `<meta property="og:site_name" content="${esc(SITE.brand.name)}">`,
    `<meta property="og:type" content="${p.ogType}">`,
    `<meta property="og:locale" content="es_MX">`,
    `<meta property="og:title" content="${esc(p.title)}">`,
    `<meta property="og:description" content="${esc(p.desc)}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:image" content="${ogImage}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(p.title)}">`,
    `<meta name="twitter:description" content="${esc(p.desc)}">`,
    `<meta name="twitter:image" content="${ogImage}">`,
    ...p.ld.map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`),
  ]
  /* Cloudflare Web Analytics — injected only when a token is set in site.json (owner pastes
     it from the CF dashboard). Cookieless/privacy-friendly, so no consent banner required. */
  const cfToken = SITE.analytics && SITE.analytics.cloudflareToken
  if (cfToken) lines.push(`<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${esc(cfToken)}"}'></script>`)
  return lines.join('\n')
}

for (const p of PAGES) {
  const file = join(DIST, p.path)
  let html = await readFile(file, 'utf8')
  const rendered = renderPage({ page: p.page, flavorId: p.flavorId })
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace('<!--pum-head-->', headBlock(p))
    .replace(/(<div id="root"[^>]*>)<\/div>/, `$1${rendered}</div>`)
  await writeFile(file, html)
  console.log(`prerendered ${p.path} (${(rendered.length / 1024).toFixed(0)} KB markup)`)
}

/* sitemap.xml — indexable pages only (legal stubs are noindex until lawyer copy lands) */
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.filter((p) => !p.noindex).map((p) => `  <url><loc>${ORIGIN}${clean(p.url)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
await writeFile(join(DIST, 'sitemap.xml'), sitemap)

/* robots.txt — open to search and AI crawlers (visibility is the goal for a new brand) */
const robots = `# ¡PUM! — todos bienvenidos, incluidos los crawlers de IA
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`
await writeFile(join(DIST, 'robots.txt'), robots)
console.log('sitemap.xml + robots.txt written')
