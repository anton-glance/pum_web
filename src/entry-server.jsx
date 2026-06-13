/* SSR entry — used only by scripts/prerender.mjs at build time (design-critique H1).
   Renders each page's full HTML so crawlers (none of the AI crawlers execute JS)
   and users get real content before hydration. */
import React from 'react'
import { renderToString } from 'react-dom/server'
import { App } from './App.jsx'
import { SubpageApp } from './SubpageApp.jsx'
import { FLAVORS, SITE, NUTRITION, PAGES } from './lib/data.js'

export function renderPage({ page, flavorId }) {
  if (page === 'index') return renderToString(<App />)
  return renderToString(<SubpageApp page={page} flavorId={flavorId} />)
}

/* Expose data for the prerender script (sitemap, JSON-LD). */
export { FLAVORS, SITE, NUTRITION, PAGES }
