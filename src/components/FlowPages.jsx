/* Post-form flow pages, rendered through the shared SubpageApp shell (Nav + Footer).
   /gracias       — shown after a successful email-capture submit ("revisa tu correo").
   /confirmacion  — Brevo's double opt-in redirectionUrl: where the confirmation link lands.
   Copy is data-driven from strings.json (STRINGS.gracias / STRINGS.confirmacion). */
import React from 'react'
import { Icon } from './ui.jsx'
import { STRINGS, LINKS } from '../lib/data.js'

function FlowPage({ data, icon, badgeBg, badgeColor }) {
  return (
    <section className="hero hero-centered" data-screen-label="Flujo">
      <div className="hero-simple center" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 78, height: 78, borderRadius: '50%', margin: '0 auto 22px',
            background: badgeBg, color: badgeColor, boxShadow: '0 6px 0 rgba(13,30,58,.12)',
          }}
        >
          <Icon name={icon} size={34} stroke={2.3} />
        </span>
        <span className="eyebrow center">{data.eyebrow}</span>
        <h1>{data.h1}</h1>
        <p className="hero-intro">{data.body}</p>
        {data.note && (
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--fg-mute)', fontWeight: 600, maxWidth: 440, margin: '0 auto 26px' }}>
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

export function GraciasPage() {
  return <FlowPage data={STRINGS.gracias} icon="mail" badgeBg="var(--pum-corn)" badgeColor="var(--pum-navy)" />
}

export function ConfirmacionPage() {
  return <FlowPage data={STRINGS.confirmacion} icon="badge-check" badgeBg="rgba(46,158,91,.16)" badgeColor="#2E9E5B" />
}
