/* Product modal — ONE component for every entry point on every page (handoff doc 06 R6, doc 04 §3).
   Identical behavior everywhere (issue 8): adding keeps the modal open, resets the picker to 1,
   leaves the button label as "Agregar N más", and shows the "✓ N bolsas agregadas · Ver tu carrito"
   note. "Ver tu carrito" calls onViewCart() — closes the modal and opens the cart drawer in place. */
import React from 'react'
import { Icon, Btn, Rating, PumImg, useFocusTrap, NutritionTable } from './ui.jsx'
import { NUTRITION, STRINGS, WAITLIST } from '../lib/data.js'
import { pumBurst } from '../lib/fx.jsx'
import { PackTilt, useMediaQuery } from '../lib/motion.jsx'

const PRICE = STRINGS.priceTarget

export function ProductModal({ flavor, cart, onClose, onAddToCart, onViewCart, onNotify }) {
  const [qty, setQty] = React.useState(1)
  const [slide, setSlide] = React.useState(0)
  const [added, setAdded] = React.useState(0)
  /* ≤680px: full-screen sheet per the approved mobile mockup ProductSheet (doc 09 §6.1) —
     image panel on top (tilt-driven), scrollable info, sticky add-bar; no thumbnail row. */
  const sheet = useMediaQuery('(max-width: 680px)')
  React.useEffect(() => { if (flavor) { setQty(1); setSlide(0); setAdded(0) } }, [flavor])
  const mainRef = React.useRef()
  const tiltRef = React.useRef()
  const panelRef = React.useRef(null)
  useFocusTrap(panelRef, !!flavor)
  const REST = 'rotateY(-7deg) rotateZ(-2deg)'

  React.useEffect(() => { const el = tiltRef.current; if (el) el.style.transform = slide === 0 ? REST : 'none' }, [slide, flavor])
  React.useEffect(() => {
    if (!flavor) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [flavor])
  if (!flavor) return null
  const f = flavor
  const dark = f.ink !== '#0D1E3A'
  const inCart = cart[f.id] || 0
  const lineCol = dark ? '#FDF7F1' : '#0D1E3A'
  const gallery = ['bag', 'flip']
  const M = STRINGS.modal
  const onTilt = (e) => { if (slide !== 0) return; const el = tiltRef.current; if (!el) return; const r = el.getBoundingClientRect(); const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2); el.style.transform = `scale(1.05) rotateY(${(px * 12 - 5).toFixed(1)}deg) rotateX(${(-py * 8).toFixed(1)}deg) rotateZ(-2deg) translate(${(px * 8).toFixed(1)}px,${(py * 6).toFixed(1)}px)` }
  const offTilt = () => { if (slide !== 0) return; const el = tiltRef.current; if (el) el.style.transform = REST }
  const crunchMain = () => { if (slide !== 0) return; const el = mainRef.current; if (el) { el.classList.remove('pum-shake'); void el.offsetWidth; el.classList.add('pum-shake') } const t = tiltRef.current; if (t) { const r = t.getBoundingClientRect(); pumBurst(r.left + r.width / 2, r.top + r.height * 0.55, { colors: [f.color, '#FFD100', '#fff'], count: 20, power: 1.2, up: true }) } }
  // Identical behavior on every page (issue 8): button text never changes to "Agregado",
  // it always reads "Agregar N más/al carrito" recomputed from the live cart + picker.
  // On the mobile sheet the not-in-cart label is the approved short form "Agregar {n}"
  // (doc 09 §6.1, locked — the long form wrapped to two lines on narrow screens).
  const addLabel = (inCart > 0 ? M.addMore : (sheet ? M.addToCartShort : M.addToCart)).replace('{n}', qty)
  const handleAdd = () => {
    onAddToCart(f, qty)
    setAdded(qty)   // drives the "✓ N bolsas agregadas · Ver tu carrito" note
    setQty(1)       // reset the quantity picker to 1 after adding
  }
  return (
    <div onClick={onClose} className="pum-modal-overlay" style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(13,30,58,.55)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: sheet ? 0 : 20 }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label={`¡PUM! ${f.name}`} onClick={(e) => e.stopPropagation()} className="pum-modal" style={sheet
        ? { position: 'relative', width: '100%', height: '100dvh', background: 'var(--pum-cream)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }
        : { position: 'relative', width: 'min(900px,100%)', maxHeight: '90vh', background: 'var(--pum-cream)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 30px 80px rgba(13,30,58,.4)', display: 'flex', alignItems: 'stretch' }}>
        <button onClick={onClose} aria-label={M.closeAria} style={{ position: 'absolute', top: 'calc(16px + env(safe-area-inset-top))', right: 16, zIndex: 6, background: '#fff', border: '1px solid var(--border)', width: sheet ? 44 : 40, height: sheet ? 44 : 40, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pum-navy)', boxShadow: '0 3px 0 rgba(13,30,58,.15)' }}><Icon name="x" size={20} stroke={2.6} /></button>
        {sheet ? (
          /* image panel on top — tilt-driven (PUM_TILT), tap to crunch, no thumbnail row */
          <div style={{ background: f.color, position: 'relative', flexShrink: 0 }}>
            <div onClick={crunchMain} style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', padding: '8px 10px' }}>
              <PackTilt amp={1}>
                <PumImg imgRef={mainRef} src={f.img} widths={[400, 800]} sizes="220px" width={800} height={1028} eager alt={f.name} style={{ display: 'block', maxHeight: 220, width: 'auto', height: 'auto', filter: 'drop-shadow(0 18px 26px rgba(13,30,58,.3))' }} />
              </PackTilt>
              <span style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-marker)', fontSize: 15, color: lineCol, opacity: 0.85, pointerEvents: 'none' }}>{M.caption}</span>
            </div>
          </div>
        ) : (
          <div style={{ background: f.color, display: 'flex', flexDirection: 'column', flex: '1 1 0', minWidth: 0, minHeight: 0 }}>
            <div onClick={crunchMain} onMouseMove={onTilt} onMouseLeave={offTilt} style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: slide === 0 ? 'pointer' : 'default', position: 'relative', padding: '12px 10px', perspective: 900 }}>
              <div ref={tiltRef} style={{ transition: 'transform .4s cubic-bezier(.22,.61,.36,1)', transform: slide === 0 ? REST : 'none', transformStyle: 'preserve-3d', willChange: 'transform' }}>
                <PumImg imgRef={mainRef} src={f.img} widths={[400, 800]} sizes="400px" width={800} height={1028} eager alt={f.name} style={{ display: 'block', maxWidth: '92%', maxHeight: '46vh', width: 'auto', height: 'auto', objectFit: 'contain', margin: '0 auto', filter: 'drop-shadow(0 18px 26px rgba(13,30,58,.3))', transform: gallery[slide] === 'flip' ? 'scaleX(-1)' : 'none' }} />
              </div>
              {slide === 0 && <span style={{ position: 'absolute', bottom: 12, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-marker)', fontSize: 16, color: lineCol, opacity: 0.85, pointerEvents: 'none' }}>{M.caption}</span>}
            </div>
            <div style={{ display: 'flex', gap: 10, padding: '0 18px 18px', justifyContent: 'center' }}>
              {gallery.map((g, i) => (
                <button key={i} onClick={() => setSlide(i)} style={{ width: 58, height: 58, borderRadius: 14, border: `2px solid ${slide === i ? lineCol : 'transparent'}`, background: 'rgba(255,255,255,.28)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4, overflow: 'hidden' }}>
                  <PumImg src={f.img} widths={[200]} sizes="50px" width={800} height={1028} eager alt="" style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', transform: g === 'flip' ? 'scaleX(-1)' : 'none' }} />
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="pum-modal-info" style={{ color: 'var(--pum-navy)', flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="pum-modal-scroll" style={{ padding: sheet ? '20px 22px 14px' : '30px 30px 14px', overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>
            {f.tag && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ background: f.color, color: f.ink, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11.5, padding: '3px 10px', borderRadius: 999 }}>{f.tag}</span>
              </div>
            )}
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: sheet ? 34 : 38, lineHeight: 1, margin: '0 0 6px' }}>{f.name}</h2>
            <p style={{ fontFamily: 'var(--font-marker)', fontSize: 19, color: f.color, margin: '0 0 12px', transform: 'rotate(-1.5deg)' }}>{f.monster}</p>
            <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--fg-soft)', fontWeight: 500, margin: '0 0 16px' }}>{f.desc}</p>
            <div style={{ display: 'flex', gap: 22, marginBottom: 18 }}>
              <Rating value={f.crunch} label={STRINGS.flavors.intensidad} fill={f.color} />
              <Rating value={f.sweet} label={STRINGS.flavors.dulzura} fill={f.color} />
            </div>
            <NutritionTable data={NUTRITION} compact={sheet} />
          </div>
          <div className="pum-modal-foot" style={{ padding: sheet ? '12px 20px calc(20px + env(safe-area-inset-bottom))' : '14px 30px 20px', borderTop: '1px solid var(--border)', flexShrink: 0, background: 'var(--pum-cream)' }}>
            {WAITLIST ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-mute)' }}>{PRICE.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, lineHeight: 1.1, color: 'var(--pum-navy)' }}>{PRICE.value}</div>
                </div>
                <Btn size="md" onClick={() => onNotify && onNotify()}><Icon name="bell" size={17} stroke={2.5} /> {STRINGS.flavors.notify}</Btn>
              </div>
            ) : (
              <React.Fragment>
                {/* fixed height (not min) so the add button row never shifts as qty / in-cart change */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, marginBottom: 14, height: 50 }}>
                  <div>
                    {inCart > 0 && (
                      <React.Fragment>
                        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-mute)' }}>{M.alreadyInCart}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, lineHeight: 1.1, color: 'var(--pum-navy)' }}>{inCart} {inCart > 1 ? M.bagPlural : M.bagSingular} · ${inCart * f.price}</div>
                      </React.Fragment>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, lineHeight: 1 }}>${f.price * qty}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-mute)', fontWeight: 700 }}>${f.price} {M.perUnitNote}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', border: '2px solid var(--pum-navy)', borderRadius: 999, overflow: 'hidden' }}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={M.minusAria} style={{ border: 'none', background: '#fff', color: 'var(--pum-navy)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, width: 42, height: 44, cursor: 'pointer' }}>−</button>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, width: 38, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', background: '#fff', color: 'var(--pum-navy)' }}>{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)} aria-label={M.plusAria} style={{ border: 'none', background: '#fff', color: 'var(--pum-navy)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, width: 42, height: 44, cursor: 'pointer' }}>+</button>
                  </div>
                  <Btn size="md" onClick={handleAdd}><Icon name="shopping-bag" size={17} stroke={2.5} /> {addLabel}</Btn>
                </div>
                {added > 0 && (
                  <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13.5, fontWeight: 700, color: '#2E9E5B' }}>
                    ✓ {added} {added > 1 ? M.addedNotePlural : M.addedNoteSingular} · <a href="#" onClick={(e) => { e.preventDefault(); onViewCart && onViewCart() }} style={{ color: 'var(--pum-navy)', fontWeight: 800, textDecoration: 'underline', cursor: 'pointer' }}>{M.viewCart}</a>
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
