/* Indexable product page /sabores/<id>.html (design-critique H3).
   Crawlers and deep links get a full document per flavor; in-site navigation still
   opens the shared ProductModal (links are intercepted in SubpageApp). */
import React from 'react'
import { Icon, Btn, Rating, PumImg, NutritionTable } from './ui.jsx'
import { FLAVORS, NUTRITION, STRINGS, LINKS, WAITLIST } from '../lib/data.js'
import { cartStore } from '../lib/cart.js'
import { pumBurst } from '../lib/fx.jsx'

export function SaborPage({ flavorId, onNotify }) {
  const f = FLAVORS.find((x) => x.id === flavorId)
  const [qty, setQty] = React.useState(1)
  const [added, setAdded] = React.useState(0)
  const M = STRINGS.modal
  const F = STRINGS.flavors
  const PRICE = STRINGS.priceTarget
  const W = STRINGS.waitlist
  if (!f) return null
  const dark = f.ink !== '#0D1E3A'
  const lineCol = dark ? '#FDF7F1' : '#0D1E3A'
  const crunch = (e) => {
    const img = e.currentTarget.querySelector('img')
    if (img) { img.classList.remove('pum-shake'); void img.offsetWidth; img.classList.add('pum-shake') }
    const r = e.currentTarget.getBoundingClientRect()
    pumBurst(r.left + r.width / 2, r.top + r.height * 0.55, { colors: [f.color, '#FFD100', '#fff'], count: 20, power: 1.2, up: true })
  }
  const others = FLAVORS.filter((x) => x.id !== f.id)
  return (
    <React.Fragment>
      {/* breadcrumb */}
      <nav aria-label="breadcrumb" className="wrap" style={{ padding: '14px 26px 0' }}>
        <ol style={{ listStyle: 'none', display: 'flex', gap: 8, margin: 0, padding: 0, fontSize: 13, fontWeight: 700, color: 'var(--fg-soft)' }}>
          <li><a href={LINKS.home} style={{ color: 'var(--fg-soft)' }}>Inicio</a></li>
          <li aria-hidden="true">·</li>
          <li><a href={LINKS.flavors} style={{ color: 'var(--fg-soft)' }}>Sabores</a></li>
          <li aria-hidden="true">·</li>
          <li aria-current="page" style={{ color: 'var(--pum-navy)' }}>{f.name}</li>
        </ol>
      </nav>
      <section className="block" style={{ paddingTop: 28 }}>
        <div className="wrap">
          <div className="split" style={{ alignItems: 'stretch' }}>
            <div onClick={crunch} style={{ background: f.color, borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '34px 20px', cursor: 'pointer', minHeight: 380, position: 'relative' }}>
              <PumImg src={f.img} widths={[400, 800]} sizes="(max-width: 820px) 80vw, 380px" width={800} height={1028} eager fetchPriority="high" alt={`Bolsa ¡PUM! ${f.name} — ${f.es}`} style={{ maxWidth: '74%', maxHeight: 420, width: 'auto', height: 'auto', filter: 'drop-shadow(0 22px 30px rgba(13,30,58,.3))' }} />
              <span style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-marker)', fontSize: 16, color: lineCol, opacity: 0.85, pointerEvents: 'none' }}>{M.caption}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 11.5, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--fg-mute)' }}>{M.eyebrow}</span>
                {f.tag && <span style={{ background: f.color, color: f.ink, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 11.5, padding: '3px 10px', borderRadius: 999 }}>{f.tag}</span>}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(34px,4.6vw,52px)', lineHeight: 1, margin: '0 0 8px', color: 'var(--pum-navy)' }}>{f.name}</h1>
              <p style={{ fontFamily: 'var(--font-marker)', fontSize: 19, color: f.color, margin: '0 0 12px', transform: 'rotate(-1.5deg)' }}>{f.monster}</p>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-soft)', fontWeight: 500, margin: '0 0 16px', maxWidth: 460 }}>{f.desc}</p>
              <div style={{ display: 'flex', gap: 22, marginBottom: 20 }}>
                <Rating value={f.crunch} label={F.intensidad} fill={f.color} />
                <Rating value={f.sweet} label={F.dulzura} fill={f.color} />
              </div>
              {WAITLIST ? (
                <React.Fragment>
                  <div style={{ background: 'var(--pum-cream-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 16px', margin: '0 0 16px', maxWidth: 460 }}>
                    <span style={{ fontWeight: 800, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--flv-fresa)' }}>{W.eyebrow}</span>
                    <p style={{ margin: '4px 0 0', fontSize: 14, lineHeight: 1.5, color: 'var(--fg-soft)', fontWeight: 600 }}>{W.body}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: 11.5, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-mute)' }}>{PRICE.label}:</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: 'var(--pum-navy)' }}>{PRICE.value}*</span>
                  </div>
                  <Btn size="lg" onClick={() => onNotify && onNotify()}><Icon name="bell" size={18} stroke={2.5} /> {F.notify}</Btn>
                  <div style={{ marginTop: 26, maxWidth: 460 }}>
                    <NutritionTable data={NUTRITION} />
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 16 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, color: 'var(--pum-navy)' }}>${f.price * qty}</span>
                    <span style={{ fontSize: 13, color: 'var(--fg-mute)', fontWeight: 700 }}>${f.price} {M.perUnitNote}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '2px solid var(--pum-navy)', borderRadius: 999, overflow: 'hidden' }}>
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={M.minusAria} style={{ border: 'none', background: '#fff', color: 'var(--pum-navy)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, width: 44, height: 46, cursor: 'pointer' }}>−</button>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, width: 40, fontSize: 17, display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', background: '#fff', color: 'var(--pum-navy)' }}>{qty}</span>
                      <button onClick={() => setQty((q) => q + 1)} aria-label={M.plusAria} style={{ border: 'none', background: '#fff', color: 'var(--pum-navy)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, width: 44, height: 46, cursor: 'pointer' }}>+</button>
                    </div>
                    <Btn size="md" onClick={() => { cartStore.add(f.id, qty); setAdded(qty); setQty(1) }}><Icon name="shopping-bag" size={17} stroke={2.5} /> {M.addToCart.replace('{n}', qty)}</Btn>
                  </div>
                  {added > 0 && (
                    <p style={{ marginTop: 12, fontSize: 13.5, fontWeight: 700, color: '#2E9E5B' }}>✓ {added} {added > 1 ? M.addedNotePlural : M.addedNoteSingular}</p>
                  )}
                  <div style={{ marginTop: 26, maxWidth: 460 }}>
                    <NutritionTable data={NUTRITION} />
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
          {/* other flavors */}
          <div style={{ marginTop: 56 }}>
            <h2 className="sec" style={{ textAlign: 'center' }}>Conoce a los otros Pumitos</h2>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}>
              {others.map((o) => (
                <a key={o.id} href={`/sabores/${o.id}.html`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 132, textDecoration: 'none' }}>
                  <span style={{ background: o.color, borderRadius: 18, width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 5px 0 rgba(13,30,58,.16)` }}>
                    <PumImg src={o.img} widths={[200]} sizes="80px" width={800} height={1028} alt={`¡PUM! ${o.name}`} style={{ maxWidth: '70%', maxHeight: 92, width: 'auto', height: 'auto' }} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: 'var(--pum-navy)' }}>{o.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}
