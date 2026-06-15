/* Cart drawer + sticky bottom cart bar + coming-soon modal (handoff doc 04 §4–5). */
import React from 'react'
import { Icon, Btn, esValidation, PumImg, useFocusTrap } from './ui.jsx'
import { FLAVORS, SITE, STRINGS, LINKS } from '../lib/data.js'
import { submitForm, honeypotProps } from '../lib/forms.js'
import { useMediaQuery, Parallax } from '../lib/motion.jsx'

export function Cart({ open, cart, onClose, onAdd, onRemove, onDelete, onCheckout }) {
  const items = FLAVORS.filter((f) => cart[f.id] > 0)
  const subtotal = items.reduce((s, f) => s + f.price * cart[f.id], 0)
  const count = items.reduce((s, f) => s + cart[f.id], 0)
  const shipping = SITE.commerce.shippingFlatMXN
  const total = subtotal + shipping
  const C = STRINGS.cart
  const sheet = useMediaQuery('(max-width: 680px)')
  const panelRef = React.useRef(null)
  useFocusTrap(panelRef, open)
  React.useEffect(() => {
    if (!open) return
    const k = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, overflow: 'hidden', display: 'flex', alignItems: sheet ? 'flex-end' : 'stretch', justifyContent: sheet ? 'center' : 'flex-end', pointerEvents: open ? 'auto' : 'none' }} aria-hidden={!open}>
      {/* Edge-anchored via flexbox (align/justify above), NOT position:absolute bottom/right:0: on iOS
          Safari those edges don't resolve on the panel's first paint, so it flashed on the wrong border
          for a frame before snapping in. Flex resolves the edge immediately. */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13,30,58,.45)', opacity: open ? 1 : 0, transition: 'opacity .25s' }} />
      <aside ref={panelRef} role="dialog" aria-modal="true" aria-label={C.title} style={sheet
        /* bottom-sheet on mobile (doc 09 §6.2, mockup CartSheet) */
        ? { position: 'relative', width: '100%', maxHeight: '86%', background: 'var(--pum-cream)', borderRadius: '26px 26px 0 0', boxShadow: '0 -18px 44px rgba(13,30,58,.3)', transform: open ? 'translateY(0)' : 'translateY(105%)', transition: 'transform .32s cubic-bezier(.22,.61,.36,1)', willChange: 'transform', display: 'flex', flexDirection: 'column' }
        : { position: 'relative', width: 'min(404px,92vw)', height: '100%', background: 'var(--pum-cream)', boxShadow: '-18px 0 44px rgba(13,30,58,.2)', transform: open ? 'translateX(0)' : 'translateX(105%)', transition: 'transform .3s cubic-bezier(.22,.61,.36,1)', willChange: 'transform', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--pum-navy)' }}>{C.title}{count > 0 ? ` · ${count} ${count > 1 ? STRINGS.modal.bagPlural : STRINGS.modal.bagSingular}` : ''}</div>
          <button onClick={onClose} aria-label={STRINGS.modal.closeAria} style={{ background: '#fff', border: '1px solid var(--border)', width: 38, height: 38, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pum-navy)' }}><Icon name="x" size={20} stroke={2.4} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px' }}>
          {items.length === 0 && <div style={{ textAlign: 'center', color: 'var(--fg-mute)', marginTop: 60 }}><Icon name="shopping-bag" size={40} stroke={1.6} /><p style={{ fontWeight: 700, marginTop: 10 }}>{C.empty1}<br />{C.empty2}</p></div>}
          {items.map((f) => (
            <div key={f.id} style={{ display: 'flex', gap: 13, alignItems: 'center', padding: '12px 0', borderBottom: '1px dashed var(--border)' }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: f.wash, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}><PumImg src={f.img} widths={[200]} sizes="40px" width={800} height={1028} alt={f.name} style={{ maxWidth: '72%', maxHeight: 48, width: 'auto', height: 'auto' }} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--pum-navy)', fontSize: 16 }}>{f.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-mute)', fontWeight: 700 }}>${f.price} {C.perUnit}</div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '2px solid var(--pum-navy)', borderRadius: 999, overflow: 'hidden' }}>
                <button onClick={() => onRemove(f)} aria-label={STRINGS.modal.minusAria} style={{ border: 'none', background: '#fff', color: 'var(--pum-navy)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, width: 30, height: 32, cursor: 'pointer' }}>−</button>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--pum-navy)', width: 26, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', background: '#fff' }}>{cart[f.id]}</span>
                <button onClick={() => onAdd(f)} aria-label={STRINGS.modal.plusAria} style={{ border: 'none', background: '#fff', color: 'var(--pum-navy)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, width: 30, height: 32, cursor: 'pointer' }}>+</button>
              </div>
              <button onClick={() => onDelete(f)} aria-label={C.deleteItem} title={C.deleteItem} style={{ border: 'none', background: 'transparent', color: 'var(--fg-mute)', width: 30, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0 }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--fg-mute)' }}>
                <Icon name="trash-2" size={17} stroke={2.2} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ padding: sheet ? '14px 20px calc(22px + env(safe-area-inset-bottom))' : '18px 22px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: 'var(--fg-soft)' }}><span>{C.subtotal}</span><span>${subtotal} MXN</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, color: 'var(--fg-soft)' }}><span>{C.shipping}</span>{shipping === 0 ? <span style={{ color: '#2E9E5B', fontWeight: 700 }}>{C.shippingFree}</span> : <span>${shipping} MXN</span>}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, color: 'var(--pum-navy)', borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}><span>{C.total}</span><span>${total} MXN</span></div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-mute)', fontWeight: 600, textAlign: 'right' }}>{C.taxNote}</div>
          </div>
          <div style={{ background: 'var(--pum-cream-2)', borderRadius: 12, padding: '10px 14px', marginBottom: 14, fontSize: 12.5, lineHeight: 1.45, color: 'var(--fg-soft)', fontWeight: 600, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}><Icon name="shield-check" size={14} stroke={2.4} color="var(--pum-navy)" /></span>
            <span>{C.parentalNotice}</span>
          </div>
          <Btn size="lg" style={{ width: '100%', justifyContent: 'center' }} variant="secondary" onClick={onCheckout}>{C.checkout} <Icon name="arrow-right" size={18} stroke={2.6} /></Btn>
        </div>
      </aside>
    </div>
  )
}

/* Sticky bottom cart bar. Clicking the bar opens the cart drawer (onOpen);
   only the corn "Ir a pagar" chip starts checkout (onCheckout — coming-soon while
   checkoutEnabled is off). Raised navy (--pum-navy-700, #16284A) so the bar reads
   against the flat-navy crunch/footer sections. */
export function CartBar({ cart, total, onOpen, onCheckout }) {
  const items = FLAVORS.filter((f) => cart[f.id] > 0)
  const count = items.reduce((s, f) => s + cart[f.id], 0)
  const show = count > 0
  const C = STRINGS.cart
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 55, transform: show ? 'translateY(0)' : 'translateY(100%)', transition: 'transform .35s cubic-bezier(.22,.61,.36,1)', pointerEvents: show ? 'auto' : 'none' }} aria-hidden={!show}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px', paddingBottom: 'calc(18px + env(safe-area-inset-bottom))' }}>
        <div onClick={onOpen} role="button" tabIndex={0} aria-label={C.title} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen() } }} style={{ width: '100%', background: 'var(--pum-navy-700)', border: 'none', borderBottom: '4px solid var(--pum-corn)', borderRadius: 22, padding: '13px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 -4px 24px rgba(0,0,0,.28), 0 12px 28px rgba(13,30,58,.32)', color: 'var(--pum-cream)', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flex: 1 }}>
            {items.slice(0, 4).map((f) => (
              <div key={f.id} style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,.25)' }}>
                  <PumImg src={f.img} widths={[200]} sizes="34px" width={800} height={1028} alt={f.name} style={{ maxWidth: '76%', maxHeight: 38, width: 'auto', height: 'auto', objectFit: 'contain' }} />
                </div>
                {cart[f.id] > 1 && <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--pum-corn)', color: 'var(--pum-navy)', fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-display)', width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart[f.id]}</span>}
              </div>
            ))}
            {items.length > 4 && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, opacity: 0.7 }}>+{items.length - 4}</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17 }}>${total}</span>
            <button onClick={(e) => { e.stopPropagation(); onCheckout() }} style={{ background: 'var(--pum-corn)', color: 'var(--pum-navy)', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, padding: '8px 18px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', whiteSpace: 'nowrap' }}><Icon name="bell" size={15} stroke={2.6} /> {C.checkoutShort}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ComingSoon({ open, onClose }) {
  const [done, setDone] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const S = STRINGS.comingSoon
  const mobile = useMediaQuery('(max-width: 680px)')
  const panelRef = React.useRef(null)
  useFocusTrap(panelRef, open)
  const onSubmit = async (e) => {
    e.preventDefault()
    setError(false)
    const { ok } = await submitForm('waitlist', { email, empresa: e.target.empresa.value })
    if (ok) setDone(true)
    else setError(true)
  }
  React.useEffect(() => { if (!open) { setDone(false); setError(false); setEmail('') } }, [open])
  React.useEffect(() => {
    if (!open) return
    const k = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])
  if (!open) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(13,30,58,.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? 18 : 20 }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={S.headline} onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: mobile ? '100%' : 'min(460px,100%)', background: 'var(--pum-cream)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 70px rgba(13,30,58,.4)' }}>
        <button onClick={onClose} aria-label={STRINGS.modal.closeAria} style={{ position: 'absolute', top: mobile ? 12 : 14, right: mobile ? 12 : 14, zIndex: 3, background: '#fff', border: '1px solid var(--border)', width: mobile ? 42 : 38, height: mobile ? 42 : 38, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pum-navy)' }}><Icon name="x" size={20} stroke={2.4} /></button>
        <div style={{ background: 'var(--pum-corn)', padding: mobile ? '26px 24px 18px' : '32px 28px 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <Parallax fx={8} fy={6}>
            <PumImg src={SITE.logos.onLight} widths={[200, 400]} sizes="140px" width={400} height={131} alt={SITE.brand.name} className="pum-pack-bob" style={{ height: mobile ? 42 : 46, width: 'auto', display: 'block', filter: 'drop-shadow(0 8px 14px rgba(13,30,58,.22))' }} />
          </Parallax>
        </div>
        <div style={{ padding: mobile ? '22px 24px 26px' : '26px 30px 30px', textAlign: 'center' }}>
          {!done ? (
            <React.Fragment>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: mobile ? 24 : 27, color: 'var(--pum-navy)', margin: '0 0 10px', lineHeight: 1.05 }}>{S.headline}</h3>
              <p style={{ fontSize: mobile ? 14.5 : 15.5, lineHeight: 1.55, color: 'var(--fg-soft)', fontWeight: 600, margin: mobile ? '0 0 18px' : '0 0 20px' }}>{S.body}</p>
              <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="email" required {...esValidation('email')} value={email} onChange={(e) => setEmail(e.target.value)} placeholder={S.emailPlaceholder} aria-label={S.emailPlaceholder} style={{ fontFamily: 'var(--font-text)', fontWeight: 600, fontSize: 15, border: '2px solid var(--pum-navy)', borderRadius: 999, padding: '13px 18px', color: 'var(--pum-navy)', background: '#fff', textAlign: 'center' }} />
                <input type="text" {...honeypotProps} />
                <Btn size="lg" type="submit" style={{ width: '100%', justifyContent: 'center' }}>{S.submit} <Icon name="bell" size={17} stroke={2.5} /></Btn>
                {error && <p style={{ fontSize: 12.5, color: 'var(--danger)', fontWeight: 700, margin: 0 }}>{STRINGS.forms.submitError}</p>}
              </form>
              <p style={{ fontSize: 11.5, color: 'var(--fg-mute)', fontWeight: 600, margin: '12px 0 0' }}>{S.consentPrefix}<a href={LINKS.legal.privacidad} style={{ color: 'var(--pum-navy)', textDecoration: 'underline' }}>{S.consentLink}</a>.</p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: mobile ? 24 : 27, color: 'var(--pum-navy)', margin: '0 0 10px' }}>{S.doneHeadline}</h3>
              <p style={{ fontSize: mobile ? 14.5 : 15.5, lineHeight: 1.55, color: 'var(--fg-soft)', fontWeight: 600, margin: mobile ? '0 0 20px' : '0 0 22px' }}>{S.doneBody}</p>
              <Btn size="lg" variant="secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>{S.doneCta}</Btn>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  )
}
