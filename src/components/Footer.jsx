/* Footer + standalone Newsletter section.
   The footer is ONE layout for every page (no useMediaQuery branch) — that branch made
   the home and inner footers differ and rendered two different DOM trees, which is exactly
   the kind of thing that destabilises hydration recovery on iOS. Responsiveness is pure CSS
   (.pum-footer* in global.css). The newsletter signup is its own section, home page only. */
import React from 'react'
import { esValidation, PumImg, PrivacyShort } from './ui.jsx'
import { FLAVORS, SITE, STRINGS, LINKS } from '../lib/data.js'
import { submitForm, honeypotProps } from '../lib/forms.js'
import { useMediaQuery } from '../lib/motion.jsx'

/* Waitlist signup — home page only, rendered as the last section before the footer. */
export function Newsletter() {
  const [done, setDone] = React.useState(false)
  const [error, setError] = React.useState(false)
  const N = STRINGS.newsletter
  const mobile = useMediaQuery('(max-width: 720px)')
  const onSubmit = async (e) => {
    e.preventDefault()
    setError(false)
    const form = e.target
    const { ok } = await submitForm('newsletter', { email: form.email.value, empresa: form.empresa.value })
    if (ok) setDone(true)
    else setError(true)
  }
  return (
    <section aria-label={N.headline} style={{ background: 'var(--pum-navy)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: mobile ? '40px 20px 8px' : '44px 26px 12px' }}>
        <div style={{ background: 'var(--pum-corn)', borderRadius: mobile ? 24 : 28, padding: mobile ? '22px 22px' : '26px 32px', display: mobile ? 'block' : 'flex', gap: 30, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', boxShadow: '0 6px 0 var(--pum-corn-deep)' }}>
          <div style={{ flex: mobile ? undefined : '0 1 auto', maxWidth: mobile ? undefined : 400, minWidth: 0 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: mobile ? 23 : 26, color: 'var(--pum-navy)', margin: '0 0 4px', whiteSpace: mobile ? undefined : 'nowrap' }}>{N.headline}</h3>
            <p style={{ color: 'var(--pum-navy)', opacity: 0.8, fontWeight: 600, margin: mobile ? '0 0 14px' : 0, fontSize: mobile ? 14.5 : 15 }}>{N.body}</p>
          </div>
          <div style={{ flex: mobile ? undefined : '0 1 500px', minWidth: 0, width: mobile ? '100%' : undefined }}>
            <form onSubmit={onSubmit} style={mobile
              ? { display: 'flex', flexDirection: 'column', gap: 9 }
              : { display: 'flex', gap: 12, alignItems: 'stretch' }}>
              <input type="email" name="email" placeholder={N.emailPlaceholder} required {...esValidation('email')} aria-label={N.emailPlaceholder} style={{ fontFamily: 'var(--font-text)', fontWeight: 600, fontSize: 15, border: '2px solid var(--pum-navy)', borderRadius: 999, padding: '13px 18px', flex: mobile ? undefined : 1, minWidth: 0, width: mobile ? '100%' : 'auto', color: 'var(--pum-navy)', background: '#fff', boxSizing: 'border-box' }} />
              <input type="text" {...honeypotProps} />
              <button type="submit" style={{ flexShrink: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, background: 'var(--pum-navy)', color: 'var(--pum-cream)', border: 'none', borderRadius: 999, padding: mobile ? '14px 24px' : '13px 26px', cursor: 'pointer', letterSpacing: '.01em', lineHeight: 1 }}>{done ? N.done : N.submit}</button>
            </form>
            {error && <p style={{ fontSize: 12.5, color: 'var(--danger)', fontWeight: 700, margin: '8px 0 0' }}>{STRINGS.forms.submitError}</p>}
            <p style={{ fontSize: 11.5, color: 'var(--pum-navy)', opacity: 0.85, fontWeight: 600, margin: '8px 0 0', lineHeight: 1.4, textAlign: mobile ? undefined : 'center' }}>{N.consentPrefix}<a href={LINKS.legal.privacidad} style={{ color: 'var(--pum-navy)', textDecoration: 'underline' }}>{N.consentLink}</a>.</p>
            <div style={{ display: 'flex', justifyContent: mobile ? 'flex-start' : 'center' }}><PrivacyShort tone="navy" align={mobile ? 'left' : 'center'} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

const socialIcon = (name) => {
  const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { flexShrink: 0 } }
  if (name === 'Instagram') return <svg {...p}><rect x="2" y="2" width="20" height="20" rx="5.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.6" cy="6.4" r="0.9" fill="currentColor" stroke="none" /></svg>
  if (name === 'YouTube') return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="4.5" /><path d="M10.2 8.8 15.4 12l-5.2 3.2z" fill="currentColor" stroke="none" /></svg>
  if (name === 'TikTok') return <svg {...p}><path d="M15 3.5c.45 2.2 1.9 3.7 4 4v3.1c-1.55 0-3-.5-4-1.35V15.5a5 5 0 1 1-5-5c.34 0 .68.03 1 .1v3.15A2 2 0 1 0 12.5 15.5V3.5H15z" /></svg>
  return null
}

export function Footer({ onFlavor }) {
  const S = STRINGS.footer
  return (
    <footer className="pum-footer">
      <div className="fwrap">
        <div className="pum-foot-main">
          <div className="pum-foot-brand">
            <PumImg src={SITE.logos.onDark} widths={[200, 400]} sizes="122px" width={400} height={132} alt={SITE.brand.name} />
            <p>{SITE.footer.blurb}</p>
          </div>
          <div className="pum-foot-cols">
            <div className="fcol">
              <h4>{S.colSabores}</h4>
              {FLAVORS.map((f) => (
                <a key={f.id} href={`/sabores/${f.id}.html`} onClick={(e) => { if (onFlavor) { e.preventDefault(); onFlavor(f) } }}>{f.name}</a>
              ))}
            </div>
            <div className="fcol">
              <h4>{S.colMarca}</h4>
              {S.marcaLinks.map((it) => (
                <a key={it.label} href={LINKS.marca[it.linkKey] || LINKS[it.linkKey]}>{it.label}</a>
              ))}
            </div>
            <div className="fcol">
              <h4>{S.colSiguenos}</h4>
              {S.socialLinks.map((label) => {
                const href = SITE.links.social[label.toLowerCase()]
                const live = href && href !== '#'
                /* Until real account URLs are set, render the row non-clickable + muted (handoff §1.4). */
                return live
                  ? <a key={label} href={href} target="_blank" rel="noopener">{socialIcon(label)}<span>{label}</span></a>
                  : <span key={label} title="Próximamente" style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.45, fontSize: 14, fontWeight: 600, padding: '5px 0', cursor: 'default' }}>{socialIcon(label)}<span>{label}</span></span>
              })}
            </div>
          </div>
        </div>
        <div className="pum-foot-contact">
          {S.contactPrefix}<a href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
          {S.contactWhatsapp}<a href={SITE.contact.whatsappHref} target="_blank" rel="noopener">{SITE.contact.whatsapp}</a>
        </div>
        <div className="pum-foot-legal">
          {S.legalLinks.map((it) => <a key={it.label} href={LINKS.legal[it.linkKey]}>{it.label}</a>)}
        </div>
        {SITE.footer.devNotice && <p style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.6, fontWeight: 600, margin: '14px 0 0', maxWidth: 720 }}>{SITE.footer.devNotice}</p>}
        <div className="pum-foot-copy"><span>{SITE.footer.copyright}</span><span>{S.tagline}</span></div>
      </div>
    </footer>
  )
}
