/* Footer + standalone Newsletter section (handoff doc 02 contract #4).
   The newsletter signup is its OWN section now (rendered only on the home page, as the
   last section before the footer) — it used to live inside the footer and showed on every
   page, duplicating the interior pages' inline notify cards.
   Sabores column opens the shared product modal in place via onFlavor (doc 04 §3). */
import React from 'react'
import { esValidation, PumImg } from './ui.jsx'
import { FLAVORS, SITE, STRINGS, LINKS, WAITLIST } from '../lib/data.js'
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
          <div style={{ flex: mobile ? undefined : '1 1 300px', minWidth: 0 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: mobile ? 23 : 26, color: 'var(--pum-navy)', margin: '0 0 4px' }}>{N.headline}</h3>
            <p style={{ color: 'var(--pum-navy)', opacity: 0.8, fontWeight: 600, margin: mobile ? '0 0 14px' : 0, fontSize: mobile ? 14.5 : 15 }}>{N.body}</p>
          </div>
          <div style={{ flex: mobile ? undefined : '0 1 auto' }}>
            <form onSubmit={onSubmit} style={mobile
              ? { display: 'flex', flexDirection: 'column', gap: 9 }
              : { display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'stretch' }}>
              <input type="email" name="email" placeholder={N.emailPlaceholder} required {...esValidation('email')} aria-label={N.emailPlaceholder} style={{ fontFamily: 'var(--font-text)', fontWeight: 600, fontSize: 15, border: '2px solid var(--pum-navy)', borderRadius: 999, padding: '13px 18px', minWidth: mobile ? 0 : 200, width: mobile ? '100%' : undefined, color: 'var(--pum-navy)', background: '#fff', boxSizing: 'border-box' }} />
              <input type="text" {...honeypotProps} />
              <button type="submit" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, background: 'var(--pum-navy)', color: 'var(--pum-cream)', border: 'none', borderRadius: 999, padding: mobile ? '14px 24px' : '13px 24px', cursor: 'pointer', letterSpacing: '.01em', lineHeight: 1 }}>{done ? N.done : N.submit}</button>
            </form>
            {error && <p style={{ fontSize: 12.5, color: 'var(--danger)', fontWeight: 700, margin: '8px 0 0' }}>{STRINGS.forms.submitError}</p>}
            <p style={{ fontSize: 11.5, color: 'var(--pum-navy)', opacity: 0.85, fontWeight: 600, margin: '8px 0 0', lineHeight: 1.4 }}>{N.consentPrefix}<a href={LINKS.legal.privacidad} style={{ color: 'var(--pum-navy)', textDecoration: 'underline' }}>{N.consentLink}</a>.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer({ onFlavor }) {
  const S = STRINGS.footer
  const mobile = useMediaQuery('(max-width: 720px)')
  const colH = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: mobile ? 15 : 16, marginBottom: mobile ? 10 : 12 }
  const colA = { display: 'block', color: 'var(--pum-cream)', opacity: 0.72, fontSize: 14, fontWeight: 600, padding: mobile ? '6px 0' : '5px 0', cursor: 'pointer', textDecoration: 'none' }
  const saboresCol = (
    <div>
      <div style={colH}>{S.colSabores}</div>
      {FLAVORS.map((f) => (
        <a key={f.id} href={`/sabores/${f.id}.html`} onClick={(e) => { if (onFlavor) { e.preventDefault(); onFlavor(f) } }} style={colA}>{f.name}</a>
      ))}
    </div>
  )
  const marcaLinks = S.marcaLinks.map((it) => (
    <a key={it.label} href={LINKS.marca[it.linkKey] || LINKS[it.linkKey]} style={colA}>{it.label}</a>
  ))
  const socialIcon = (name) => {
    const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: { flexShrink: 0 } }
    if (name === 'Instagram') return <svg {...p}><rect x="2" y="2" width="20" height="20" rx="5.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.6" cy="6.4" r="0.9" fill="currentColor" stroke="none" /></svg>
    if (name === 'YouTube') return <svg {...p}><rect x="2" y="5" width="20" height="14" rx="4.5" /><path d="M10.2 8.8 15.4 12l-5.2 3.2z" fill="currentColor" stroke="none" /></svg>
    if (name === 'TikTok') return <svg {...p}><path d="M15 3.5c.45 2.2 1.9 3.7 4 4v3.1c-1.55 0-3-.5-4-1.35V15.5a5 5 0 1 1-5-5c.34 0 .68.03 1 .1v3.15A2 2 0 1 0 12.5 15.5V3.5H15z" /></svg>
    return null
  }
  const socialLinks = (align = 'left') => S.socialLinks.map((label) => (
    <a key={label} href={SITE.links.social[label.toLowerCase()]} style={{ ...colA, display: 'flex', alignItems: 'center', gap: 8, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>{socialIcon(label)}<span>{label}</span></a>
  ))
  return (
    <footer style={{ background: 'var(--pum-navy)', color: 'var(--pum-cream)' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: mobile ? '38px 20px 22px' : '54px 26px 24px' }}>
        {mobile ? (
          <React.Fragment>
            <div>
              <PumImg src={SITE.logos.onDark} widths={[200, 400]} sizes="109px" width={400} height={132} alt={SITE.brand.name} style={{ height: 36, width: 'auto' }} />
              <p style={{ opacity: 0.7, fontSize: 14, lineHeight: 1.55, margin: '12px 0 0', fontWeight: 500 }}>{SITE.footer.blurb}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 16px', marginTop: 28 }}>
              {saboresCol}
              <div>
                <div style={colH}>{S.colMarca}</div>
                {marcaLinks}
                <div style={{ ...colH, marginTop: 18 }}>{S.colSiguenos}</div>
                {socialLinks('left')}
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(253,247,241,.16)', marginTop: 28, paddingTop: 16, fontSize: 13, opacity: 0.7, fontWeight: 500, lineHeight: 1.7 }}>
              {S.contactPrefix}<a href={`mailto:${SITE.contact.email}`} style={{ color: 'var(--pum-cream)', fontWeight: 700 }}>{SITE.contact.email}</a><br />
              {S.contactBilling.replace(/^ · /, '')}<a href={`mailto:${SITE.contact.billingEmail}`} style={{ color: 'var(--pum-cream)', fontWeight: 700 }}>{SITE.contact.billingEmail}</a><br />
              {S.contactWhatsapp.replace(/^ · /, '')}<a href={SITE.contact.whatsappHref} target="_blank" rel="noopener" style={{ color: 'var(--pum-cream)', fontWeight: 700 }}>{SITE.contact.whatsapp}</a>
            </div>
            {!WAITLIST && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', opacity: 0.6, marginTop: 14, flexWrap: 'wrap' }}>
                {SITE.footer.paymentBadges.map((c) => <span key={c} style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.04em', background: 'rgba(253,247,241,.12)', border: '1px solid rgba(253,247,241,.2)', borderRadius: 6, padding: '4px 10px', color: 'var(--pum-cream)' }}>{c}</span>)}
              </div>
            )}
            <div style={{ borderTop: '1px solid rgba(253,247,241,.1)', marginTop: 16, paddingTop: 14, display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: 12, opacity: 0.5, fontWeight: 600 }}>
              {S.legalLinks.map((it) => <a key={it.label} href={LINKS.legal[it.linkKey]} style={{ color: 'var(--pum-cream)', textDecoration: 'underline', cursor: 'pointer' }}>{it.label}</a>)}
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, fontSize: 12.5, opacity: 0.6, fontWeight: 600 }}>
              <span>{SITE.footer.copyright}</span><span>{S.tagline}</span>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="pum-footcols" style={{ display: 'flex', gap: 40, justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: 300, flex: '1 1 240px' }}>
                <PumImg src={SITE.logos.onDark} widths={[200, 400]} sizes="122px" width={400} height={132} alt={SITE.brand.name} style={{ height: 40, width: 'auto' }} />
                <p style={{ opacity: 0.7, fontSize: 14, lineHeight: 1.55, marginTop: 14, fontWeight: 500 }}>{SITE.footer.blurb}</p>
              </div>
              {/* link columns grouped together, pushed right + right-aligned */}
              <div style={{ display: 'flex', gap: 40, textAlign: 'right' }}>
                {saboresCol}
                <div>
                  <div style={colH}>{S.colMarca}</div>
                  {marcaLinks}
                </div>
                <div>
                  <div style={colH}>{S.colSiguenos}</div>
                  {socialLinks('right')}
                </div>
              </div>
            </div>
            {/* contact + payment badges */}
            <div style={{ borderTop: '1px solid rgba(253,247,241,.16)', marginTop: 32, paddingTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ fontSize: 13, opacity: 0.7, fontWeight: 500, lineHeight: 1.6 }}>
                {S.contactPrefix}<a href={`mailto:${SITE.contact.email}`} style={{ color: 'var(--pum-cream)', fontWeight: 700 }}>{SITE.contact.email}</a>
                {S.contactBilling}<a href={`mailto:${SITE.contact.billingEmail}`} style={{ color: 'var(--pum-cream)', fontWeight: 700 }}>{SITE.contact.billingEmail}</a>
                {S.contactWhatsapp}<a href={SITE.contact.whatsappHref} target="_blank" rel="noopener" style={{ color: 'var(--pum-cream)', fontWeight: 700 }}>{SITE.contact.whatsapp}</a>
              </div>
              {!WAITLIST && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', opacity: 0.6 }}>
                  {SITE.footer.paymentBadges.map((c) => <span key={c} style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.04em', background: 'rgba(253,247,241,.12)', border: '1px solid rgba(253,247,241,.2)', borderRadius: 6, padding: '4px 10px', color: 'var(--pum-cream)' }}>{c}</span>)}
                </div>
              )}
            </div>
            {/* legal links */}
            <div style={{ borderTop: '1px solid rgba(253,247,241,.1)', marginTop: 14, paddingTop: 14, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 18, fontSize: 12, opacity: 0.5, fontWeight: 600 }}>
              {S.legalLinks.map((it) => <a key={it.label} href={LINKS.legal[it.linkKey]} style={{ color: 'var(--pum-cream)', textDecoration: 'underline', cursor: 'pointer' }}>{it.label}</a>)}
            </div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 13, opacity: 0.6, fontWeight: 600 }}>
              <span>{SITE.footer.copyright}</span><span>{S.tagline}</span>
            </div>
          </React.Fragment>
        )}
      </div>
    </footer>
  )
}
