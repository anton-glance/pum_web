/* Post-form flow pages, rendered through the shared SubpageApp shell (Nav + Footer).
   /confirmacion — shown after a successful email-capture submit ("revisa tu correo").
   /gracias      — Brevo's double opt-in redirectionUrl: where the confirm link lands ("ya eres del crunch").
   Copy is data-driven from strings.json (STRINGS.confirmacion / STRINGS.gracias). */
import React from 'react'
import { Icon } from './ui.jsx'
import { STRINGS, LINKS } from '../lib/data.js'

function FlowPage({ data }) {
  return (
    <section className="hero hero-centered" data-screen-label="Flujo">
      <div className="hero-simple center" style={{ paddingTop: 64, paddingBottom: 56 }}>
        <h1>{data.h1}</h1>
        <p className="hero-intro">{data.body}</p>
        {data.note && (
          <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--fg-mute)', fontWeight: 600, maxWidth: 420, margin: '-8px auto 26px' }}>
            {data.note}
          </p>
        )}
        <div className="hero-cta" style={{ justifyContent: 'center' }}>
          <a className="btn btn-primary btn-lg" href={LINKS.flavors}>{data.ctaPrimary} <Icon name="arrow-right" size={18} stroke={2.5} /></a>
          <a className="btn btn-secondary btn-lg" href={LINKS.home}>{data.ctaSecondary}</a>
        </div>
      </div>
    </section>
  )
}

/* "Revisa tu correo" — shown right after submit. */
export function ConfirmacionPage() {
  return <FlowPage data={STRINGS.confirmacion} />
}

/* "¡Listo, ya eres del crunch!" — shown after the opt-in link is clicked. */
export function GraciasPage() {
  return <FlowPage data={STRINGS.gracias} />
}
