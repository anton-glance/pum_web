/* Homepage sections: Hero, Flavor grid, Crunch game, Para Papás — ported 1:1 from app.jsx.
   Mobile hero (≤720px) follows the approved mobile mockup MHero (handoff doc 09 §4):
   motion-only monsters framing the pack, tilt-driven pack, centered text, CTAs below. */
import React from 'react'
import { Icon, Btn, Rating, PumImg } from './ui.jsx'
import { FLAVORS, GAME, STRINGS, LINKS, WAITLIST } from '../lib/data.js'
import { pumBurst, GooglyMonster } from '../lib/fx.jsx'
import { Parallax, PackTilt, useMediaQuery } from '../lib/motion.jsx'

/* En-desarrollo explainer (T0.1b): the site is a real informative page that says plainly
   ¡PUM! is a product in development with target specs + a waitlist. */
export function EnDesarrollo({ onNotify, compact = false }) {
  const W = STRINGS.waitlist
  return (
    <section aria-label={W.eyebrow} style={{ background: 'var(--pum-cream)', padding: compact ? '0 22px 8px' : '0 26px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', background: 'var(--pum-cream-2)', border: '1px solid var(--border)', borderRadius: 20, padding: compact ? '18px 20px' : '22px 26px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ flex: '1 1 320px' }}>
          <span style={{ fontWeight: 800, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--flv-fresa)' }}>{W.eyebrow}</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: compact ? 20 : 22, color: 'var(--pum-navy)', margin: '6px 0 6px', lineHeight: 1.1 }}>{W.title}</h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'var(--fg-soft)', fontWeight: 600, margin: 0 }}>{W.body}</p>
        </div>
        <Btn size="md" onClick={onNotify}>{W.cta} <Icon name="bell" size={16} stroke={2.5} /></Btn>
      </div>
    </section>
  )
}

/* ---------------- HERO ---------------- */
const Tagline = ({ H, size = 18, margin = '12px 0 0' }) => (
  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size, margin, textAlign: 'center' }}><span style={{ color: '#E12251' }}>{H.tagline[0]}</span> <span style={{ color: 'var(--pum-navy)' }}>{H.tagline[1]}</span> <span style={{ color: '#3C7A1E' }}>{H.tagline[2]}</span></p>
)

/* Monster anchored to the PACK container at a vertical % of the pack's height
   (its center sits at `top` via translateY(-50%)); `side`/`off` place it just
   outside the pack edge. Parallax adds gentle tilt life; pointerEvents off so it
   never blocks the pack. Positions (per request): purple 10% · pink 55% · green 86%. */
function PackMonster({ color, size, top, side = 'left', off = '-14%', fx = 10, fy = 7, rot = 0 }) {
  const pos = side === 'left' ? { left: off } : { right: off }
  return (
    <div style={{ position: 'absolute', top, ...pos, transform: 'translateY(-50%)', zIndex: 4, pointerEvents: 'none' }}>
      <Parallax fx={fx} fy={fy} rot={rot}><GooglyMonster color={color} size={size} onPoke={() => {}} /></Parallax>
    </div>
  )
}
const HERO_MONSTERS = [
  { key: 'purple', color: '#7A3FA0', top: '10%', side: 'right', off: '-13%' },
  { key: 'pink', color: '#FF4B7D', top: '55%', side: 'left', off: '-16%' },
  { key: 'green', color: '#8BC53F', top: '86%', side: 'right', off: '-12%' },
]

export function Hero({ onNav }) {
  const packRef = React.useRef()
  const mobile = useMediaQuery('(max-width: 720px)')
  const heroFlavor = FLAVORS.find((f) => f.id === GAME.firstBagFlavorId) || FLAVORS[0]
  const H = STRINGS.hero
  const REST = 'rotateY(-8deg) rotateZ(-3deg)'
  const onTilt = (e) => { const el = packRef.current; if (!el) return; const r = el.getBoundingClientRect(); const px = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); const py = (e.clientY - (r.top + r.height / 2)) / (r.height / 2); el.style.transform = `scale(1.05) rotateY(${(px * 12 - 6).toFixed(1)}deg) rotateX(${(-py * 8).toFixed(1)}deg) rotateZ(-2deg) translate(${(px * 9).toFixed(1)}px,${(py * 6).toFixed(1)}px)` }
  const offTilt = () => { const el = packRef.current; if (el) el.style.transform = REST }
  const burst = (e) => { const r = e.currentTarget.getBoundingClientRect(); pumBurst(r.left + r.width / 2, r.top + r.height * 0.55, { colors: ['#FFD100', '#F2B632', '#fff'], count: 26, power: 1.3, up: true }) }

  if (mobile) {
    /* Approved mobile hero (mockup MHero): monsters move ONLY with tilt/drag,
       pack tilts both directions, no category pill, centered copy, CTAs below pack. */
    return (
      <section id="top" style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(130% 110% at 70% 0%, #FFD64D 0%, #F2B632 55%, #EDA91E 100%)' }}>
        <div style={{ padding: '20px 22px 44px', position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 43, lineHeight: 0.97, letterSpacing: '-.015em', color: 'var(--pum-navy)', margin: '6px 0 10px' }}>{H.headline1}<br />{H.headline2}</h1>
          <p style={{ fontSize: 15.5, lineHeight: 1.5, color: 'var(--pum-navy)', opacity: 0.85, margin: '0 auto 6px', fontWeight: 600, maxWidth: 300 }}>{H.body}</p>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 6 }}>
            <Parallax fx={-7} fy={-5} style={{ position: 'absolute', width: 330, height: 330, top: '50%', left: '50%', marginLeft: -165, marginTop: -165, pointerEvents: 'none', zIndex: -1 }}>
              <div className="pum-halo" style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.62) 0%, rgba(255,255,255,.18) 46%, rgba(255,255,255,0) 70%)' }} />
            </Parallax>
            <div style={{ position: 'absolute', bottom: '3%', left: '50%', width: '52%', height: 30, transform: 'translateX(-50%)', background: 'radial-gradient(ellipse at center, rgba(13,30,58,.42) 0%, rgba(13,30,58,0) 72%)', filter: 'blur(4px)', pointerEvents: 'none' }} />
            <div className="pum-pack-bob" style={{ position: 'relative', width: 230, zIndex: 2 }}>
              <PackMonster color="#7A3FA0" size={38} top="10%" side="right" off="-22%" fx={-9} fy={7} />
              <PackMonster color="#FF4B7D" size={52} top="55%" side="left" off="-26%" fx={14} fy={10} rot={3} />
              <PackMonster color="#8BC53F" size={44} top="86%" side="right" off="-24%" fx={-18} fy={-12} rot={-4} />
              <PackTilt amp={1.15}>
                <div onClick={burst} style={{ cursor: 'pointer' }}>
                  <PumImg imgRef={packRef} src={heroFlavor.img} widths={[200, 400, 800]} sizes="230px" width={800} height={1028} eager fetchPriority="high" alt={H.packAlt} style={{ display: 'block', width: '100%', height: 'auto', filter: 'drop-shadow(0 26px 36px rgba(13,30,58,.38)) drop-shadow(0 8px 14px rgba(13,30,58,.22))' }} />
                </div>
              </PackTilt>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320, margin: '20px auto 0' }}>
            <Btn size="lg" variant="secondary" onClick={() => onNav('flavors')}>{H.ctaPrimary} <Icon name="arrow-right" size={19} stroke={2.6} /></Btn>
            <Btn size="lg" variant="ghost" onClick={() => onNav('crunch')}>{H.ctaSecondary}</Btn>
          </div>
          <Tagline H={H} size={17} margin="16px 0 0" />
        </div>
      </section>
    )
  }

  return (
    <section id="top" style={{ position: 'relative', overflow: 'hidden', background: 'radial-gradient(120% 120% at 70% 0%, #FFD64D 0%, #F2B632 55%, #EDA91E 100%)' }}>
      <div className="pum-hero-grid" style={{ maxWidth: 1140, margin: '0 auto', padding: '46px 26px 60px', display: 'grid', gridTemplateColumns: '1.04fr .96fr', gap: 24, alignItems: 'center', position: 'relative', zIndex: 3 }}>
        <div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--pum-navy)', color: 'var(--pum-cream)', fontWeight: 800, fontSize: 13, letterSpacing: '.05em', textTransform: 'uppercase', padding: '7px 15px', borderRadius: 999 }}><Icon name="sparkles" size={15} stroke={2.4} /> {H.badge}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(42px,6.2vw,78px)', lineHeight: 0.96, letterSpacing: '-.015em', color: 'var(--pum-navy)', margin: '16px 0 12px' }}>{H.headline1}<br />{H.headline2}</h1>
          <p style={{ fontSize: 18, lineHeight: 1.5, color: 'var(--pum-navy)', opacity: 0.85, maxWidth: 430, margin: '0 0 24px', fontWeight: 600 }}>{H.body}</p>
          <div style={{ display: 'flex', gap: 13, flexWrap: 'wrap' }}>
            <Btn size="lg" variant="secondary" onClick={() => onNav('flavors')}>{H.ctaPrimary} <Icon name="arrow-right" size={19} stroke={2.6} /></Btn>
            <Btn size="lg" variant="ghost" onClick={() => onNav('crunch')}>{H.ctaSecondary}</Btn>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <div className="pum-halo" style={{ position: 'absolute', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.62) 0%, rgba(255,255,255,.18) 46%, rgba(255,255,255,0) 70%)', top: '47%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '5%', left: '50%', width: '56%', height: 38, transform: 'translateX(-50%)', background: 'radial-gradient(ellipse at center, rgba(13,30,58,.42) 0%, rgba(13,30,58,0) 72%)', filter: 'blur(4px)', pointerEvents: 'none' }} />
            <div className="pum-pack-bob" style={{ position: 'relative', width: '84%', maxWidth: 360, zIndex: 2 }}>
              {HERO_MONSTERS.map((m) => (
                <PackMonster key={m.key} color={m.color} size={m.key === 'pink' ? 60 : m.key === 'green' ? 56 : 46} top={m.top} side={m.side} off={m.off} />
              ))}
              <div style={{ perspective: 1000 }}>
                <div ref={packRef} onMouseMove={onTilt} onMouseLeave={offTilt} onClick={burst}
                  style={{ cursor: 'pointer', transition: 'transform .4s cubic-bezier(.22,.61,.36,1)', transform: 'rotateY(-8deg) rotateZ(-3deg)', transformStyle: 'preserve-3d', willChange: 'transform' }}>
                  <PumImg src={heroFlavor.img} widths={[200, 400, 800]} sizes="(max-width: 820px) 84vw, 360px" width={800} height={1028} eager fetchPriority="high" alt={H.packAlt} style={{ display: 'block', width: '100%', height: 'auto', filter: 'drop-shadow(0 30px 42px rgba(13,30,58,.38)) drop-shadow(0 8px 14px rgba(13,30,58,.22))' }} />
                </div>
              </div>
            </div>
          </div>
          <Tagline H={H} />
        </div>
      </div>
    </section>
  )
}

/* ---------------- FLAVOR PLAYGROUND ---------------- */
export function FlavorCard({ f, qty, onAdd, onOpen, onNotify }) {
  const [hover, setHover] = React.useState(false)
  const imgRef = React.useRef()
  const F = STRINGS.flavors
  const mobile = useMediaQuery('(max-width: 720px)')
  const crunch = (e) => {
    e.stopPropagation()
    const el = imgRef.current
    if (el) { el.classList.remove('pum-shake'); void el.offsetWidth; el.classList.add('pum-shake'); const r = el.getBoundingClientRect(); pumBurst(r.left + r.width / 2, r.top + r.height * 0.62, { colors: [f.color, '#FFD100', '#fff'], count: 22, power: 1.2, up: true }) }
  }
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ position: 'relative', paddingTop: 14, height: '100%', display: 'flex', flexDirection: 'column', transform: hover ? 'translateY(-5px)' : 'none', transition: 'transform .2s cubic-bezier(.34,1.56,.64,1)' }}>
      {f.tag && <span style={{ position: 'absolute', top: -2, left: 10, zIndex: 5, background: 'var(--pum-navy)', color: 'var(--pum-cream)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, padding: '5px 13px', borderRadius: 999, boxShadow: '0 3px 10px rgba(0,0,0,.32)', border: '2.5px solid rgba(255,255,255,.92)', transform: 'rotate(-5deg)', display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>{f.tag === 'Favorito' && <Icon name="star" size={11} stroke={2.5} />}{f.tag === 'Nuevo' && <Icon name="flame" size={11} stroke={2.5} />} {f.tag}</span>}
      <div onClick={() => onOpen && onOpen(f)} style={{ background: f.color, borderRadius: 24, overflow: 'hidden', position: 'relative', cursor: 'pointer', flex: '1 1 auto', display: 'flex', flexDirection: 'column', boxShadow: hover ? `0 12px 0 ${f.ink === '#0D1E3A' ? 'rgba(13,30,58,.18)' : 'rgba(0,0,0,.2)'},0 24px 42px rgba(13,30,58,.20)` : `0 7px 0 ${f.ink === '#0D1E3A' ? 'rgba(13,30,58,.16)' : 'rgba(0,0,0,.18)'},0 12px 24px rgba(13,30,58,.10)`, transition: 'box-shadow .2s' }}>
        <div onClick={(e) => { crunch(e); onOpen && onOpen(f) }} style={{ margin: '14px 14px 0', borderRadius: 18, background: 'rgba(255,255,255,.22)', height: mobile ? 188 : 198, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '14px 12px 4px', cursor: 'pointer', position: 'relative' }}>
          <PumImg imgRef={imgRef} src={f.img} widths={[200, 400]} sizes="145px" width={800} height={1028} alt={f.name} style={{ maxWidth: mobile ? '62%' : '70%', maxHeight: mobile ? 172 : 184, width: 'auto', height: 'auto', filter: 'drop-shadow(0 14px 18px rgba(13,30,58,.22))', transform: hover ? 'scale(1.05) rotate(-2deg)' : 'none', transition: 'transform .2s' }} />
          {/* mobile: hint always visible (no hover on touch) — mockup MFlavorCard */}
          <span style={{ position: 'absolute', bottom: 8, right: 14, fontFamily: 'var(--font-marker)', fontSize: mobile ? 14 : 15, color: f.ink, opacity: mobile ? 0.75 : (hover ? 0.9 : 0), transform: mobile ? 'rotate(-6deg)' : (hover ? 'rotate(-6deg) translateY(0)' : 'rotate(-6deg) translateY(6px)'), transition: '.2s' }}>{F.crunchMe}</span>
        </div>
        <div style={{ padding: '15px 18px 18px', color: f.ink, flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: f.ink, lineHeight: 1, margin: 0 }}>{f.name}</h3>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: f.ink }}>${f.price} <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.7 }}>MXN*</span></span>
          </div>
          <p style={{ fontSize: 13.5, color: f.ink, opacity: 0.82, margin: '7px 0 12px', fontWeight: 600, lineHeight: 1.4, minHeight: mobile ? 0 : 38 }}>{f.blurb}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <Rating value={f.crunch} label={F.intensidad} fill={f.ink} ink={f.ink} track={f.ink === '#0D1E3A' ? 'rgba(13,30,58,.16)' : 'rgba(255,255,255,.4)'} />
            <Rating value={f.sweet} label={F.dulzura} fill={f.ink} ink={f.ink} track={f.ink === '#0D1E3A' ? 'rgba(13,30,58,.16)' : 'rgba(255,255,255,.4)'} />
          </div>
          {WAITLIST
            ? <Btn size="md" variant="light" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }} onClick={(e) => { e.stopPropagation(); onNotify && onNotify() }}><Icon name="bell" size={16} stroke={2.6} /> {F.notify}</Btn>
            : qty === 0
              ? <Btn size="md" variant="light" style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }} onClick={(e) => { e.stopPropagation(); onAdd(f) }}><Icon name="plus" size={17} stroke={3} /> {F.add}</Btn>
              : (
                <div style={{ display: 'flex', alignItems: 'center', border: '2.5px solid var(--pum-navy)', borderRadius: 999, overflow: 'hidden', background: '#fff', width: '100%', height: mobile ? 48 : 46, marginTop: 'auto' }} onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onAdd({ ...f, delta: -1 })} aria-label={STRINGS.modal.minusAria} style={{ border: 'none', background: 'transparent', color: 'var(--pum-navy)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, width: mobile ? 48 : 46, height: '100%', cursor: 'pointer', flexShrink: 0 }}>−</button>
                  <span onClick={(e) => { e.stopPropagation(); onOpen && onOpen(f) }} style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--pum-navy)', cursor: 'pointer', alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{qty} {F.inCart}</span>
                  <button onClick={() => onAdd(f)} aria-label={STRINGS.modal.plusAria} style={{ border: 'none', background: 'var(--pum-navy)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, width: mobile ? 48 : 46, height: '100%', cursor: 'pointer', flexShrink: 0 }}>+</button>
                </div>
              )}
        </div>
      </div>
    </div>
  )
}

export function FlavorPlayground({ cart, onAdd, onOpen, onNotify }) {
  const F = STRINGS.flavors
  const mobile = useMediaQuery('(max-width: 720px)')
  return (
    <section id="flavors" style={{ background: 'var(--pum-cream)', padding: mobile ? '54px 22px 60px' : '74px 26px 80px' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: mobile ? 30 : 40 }}>
          <span style={{ fontWeight: 800, fontSize: mobile ? 12 : 13, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--flv-fresa)' }}>{F.eyebrow}</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: mobile ? 32 : 'clamp(32px,4.4vw,50px)', color: 'var(--pum-navy)', margin: '8px 0 6px' }}>{F.headline}</h2>
          <p style={{ fontSize: mobile ? 15 : 17, color: 'var(--fg-soft)', maxWidth: mobile ? 320 : 520, margin: '0 auto', fontWeight: 600 }}>{F.body}</p>
        </div>
        <div className="pum-flavgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: mobile ? 24 : 22 }}>
          {FLAVORS.map((f) => <FlavorCard key={f.id} f={f} qty={cart[f.id] || 0} onAdd={onAdd} onOpen={onOpen} onNotify={onNotify} />)}
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--fg-mute)', fontWeight: 600, lineHeight: 1.5, margin: mobile ? '20px auto 0' : '24px auto 0', maxWidth: 640, textAlign: 'center' }}>{F.priceFootnote}</p>
      </div>
    </section>
  )
}

/* ---------------- CRUNCH ZONE · llena la pantalla de PUM ---------------- */
const _r = (a, b) => a + Math.random() * (b - a)
function crunchBatch(level) {
  const out = []
  const PER = GAME.puffsPerLayer
  const mk = (x, y) => {
    out.push({
      id: level + '-' + out.length + '-' + Math.random(), x, y,
      src: GAME.sprites[Math.floor(Math.random() * GAME.sprites.length)],
      size: _r(GAME.puffSizePxRange[0], GAME.puffSizePxRange[1]),
      rot: _r(GAME.rotationDegRange[0], GAME.rotationDegRange[1]),
      flip: Math.random() > 0.5 ? 1 : -1,
      bright: _r(GAME.brightnessRange[0], GAME.brightnessRange[1]),
      hue: _r(GAME.hueRotateDegRange[0], GAME.hueRotateDegRange[1]),
      delay: _r(GAME.entranceDelayMsRange[0] / 1000, GAME.entranceDelayMsRange[1] / 1000),
    })
  }
  const span = GAME.layerSpanPct, gap = GAME.layerGapPct, baseOff = GAME.baseOffsetBelowFramePct
  const top = 100 - (level + 1) * span - gap * level + baseOff
  const bot = 100 - level * span - gap * level + 2 + baseOff
  const cols = GAME.gridColumns, rows = Math.ceil(PER / cols), cw = 110 / cols, ch = (bot - top) / rows
  let n = 0
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols && n < PER; c++, n++) mk(-5 + c * cw + _r(0.12, 0.88) * cw, top + r * ch + _r(0.12, 0.88) * ch)
  return out
}

export function CrunchZone({ onOpen }) {
  const FULL = GAME.tapsToFill
  const [level, setLevel] = React.useState(0)
  const [puffs, setPuffs] = React.useState([])
  const firstIdx = Math.max(0, FLAVORS.findIndex((f) => f.id === GAME.firstBagFlavorId))
  const [bagIdx, setBagIdx] = React.useState(firstIdx)
  const [hinted, setHinted] = React.useState(false)
  const levelRef = React.useRef(0)
  const bagRef = React.useRef()
  const stageRef = React.useRef()
  const full = level >= FULL
  const curFlavor = FLAVORS[bagIdx]
  const G = STRINGS.game
  const mobile = useMediaQuery('(max-width: 720px)')
  const hit = () => {
    setHinted(true)
    const el = bagRef.current
    if (el) { el.classList.remove('pum-crunch-pop'); void el.offsetWidth; el.classList.add('pum-crunch-pop') }
    const st = stageRef.current, r = st.getBoundingClientRect()
    pumBurst(r.left + r.width / 2, r.top + r.height * 0.52, { colors: [curFlavor.color, '#FFD100', '#fff'], count: 16, power: 1.1, up: true })
    if (levelRef.current >= FULL) {
      // cycle: clear puffs, pick a new random bag (different from current)
      let next
      do { next = Math.floor(Math.random() * FLAVORS.length) } while (next === bagIdx && FLAVORS.length > 1)
      levelRef.current = 0; setLevel(0); setPuffs([]); setBagIdx(next)
      return
    }
    const lv = levelRef.current
    const batch = crunchBatch(lv)
    levelRef.current = lv + 1; setLevel(lv + 1); setPuffs((ps) => ps.concat(batch))
    if (lv + 1 >= FULL) { for (let k = 0; k < 4; k++) setTimeout(() => pumBurst(window.innerWidth * (0.3 + Math.random() * 0.4), r.top + r.height * 0.4, { count: 26, power: 1.5, up: true }), k * 120) }
  }
  return (
    <section id="crunch" ref={stageRef} onClick={hit} role="button" tabIndex={0} aria-label={G.idleHeadline} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hit() } }} style={{ background: 'var(--pum-navy)', color: 'var(--pum-cream)', minHeight: mobile ? 480 : 520, position: 'relative', overflow: 'hidden', cursor: 'pointer', userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}>
      {puffs.map((p) => (
        <div key={p.id} className="pum-puff" style={{ left: p.x + '%', top: p.y + '%', width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2, animation: `pum-puff-drop .5s cubic-bezier(.34,1.4,.5,1) ${p.delay}s forwards` }}>
          <img src={p.src} alt="" style={{ width: '100%', display: 'block', transform: `rotate(${p.rot}deg) scaleX(${p.flip})`, filter: `brightness(${p.bright}) hue-rotate(${p.hue}deg)` }} />
        </div>
      ))}
      <div style={{ position: 'absolute', top: mobile ? 30 : 36, left: 0, right: 0, textAlign: 'center', zIndex: 5, pointerEvents: 'none', padding: mobile ? '0 22px' : '0 24px' }}>
        {!full && <span style={{ fontWeight: 800, fontSize: mobile ? 12 : 13, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--pum-corn)' }}>{G.eyebrow}</span>}
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px,3.8vw,46px)', lineHeight: 1.04, margin: '8px 0 0', color: full ? 'var(--pum-navy)' : 'inherit', textShadow: full ? '0 0 14px rgba(242,182,50,.95), 0 0 28px rgba(242,182,50,.7), 0 2px 4px rgba(242,182,50,.6)' : 'none' }}>{full ? G.fullHeadline : G.idleHeadline}</h2>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: mobile ? '56%' : '58%', transform: 'translateY(-50%)', zIndex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: mobile ? 18 : 'min(5vw,30px)', pointerEvents: 'none' }}>
        {!hinted && <div className="pum-arrow-l" style={{ color: 'var(--pum-corn)', display: 'flex' }}><Icon name="chevrons-right" size={mobile ? 42 : 50} stroke={3} /></div>}
        <div ref={bagRef} className="pum-bag-idle" style={{ width: mobile ? 170 : 'min(40vw,260px)', flexShrink: 0 }}>
          <PumImg src={curFlavor.img} widths={[200, 400, 800]} sizes={mobile ? '170px' : 'min(40vw, 260px)'} width={800} height={1028} alt={G.bagAltPrefix + curFlavor.name} style={{ width: '100%', height: 'auto', display: 'block', filter: 'drop-shadow(0 18px 28px rgba(0,0,0,.42))', pointerEvents: 'none' }} />
        </div>
        {!hinted && <div className="pum-arrow-r" style={{ color: 'var(--pum-corn)', display: 'flex' }}><Icon name="chevrons-left" size={mobile ? 42 : 50} stroke={3} /></div>}
      </div>
      {full && (
        <div style={mobile
          ? { position: 'absolute', left: 0, right: 0, bottom: 18, zIndex: 5, display: 'flex', justifyContent: 'center' }
          : { position: 'absolute', right: 24, bottom: 20, zIndex: 5 }}>
          <Btn size="lg" style={{ justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); onOpen(curFlavor) }}><span>{G.takeIt}</span> <Icon name="shopping-bag" size={18} stroke={2.5} /></Btn>
        </div>
      )}
    </section>
  )
}

/* ---------------- STORY · Para Papás ---------------- */
export function Story() {
  const S = STRINGS.story
  const mobile = useMediaQuery('(max-width: 720px)')
  return (
    <section id="story" style={{ background: 'var(--pum-cream-2)', padding: mobile ? '54px 22px' : '74px 26px' }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <div style={mobile ? undefined : { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 44, alignItems: 'center' }} className={mobile ? undefined : 'pum-crunch-wrap'}>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: mobile ? 26 : 0 }}>
            {mobile
              ? (
                <Parallax fx={9} fy={7}>
                  <PumImg src="/assets/brand/mark-corn-u-trans.png" widths={[200, 400]} sizes="120px" width={600} height={900} alt={S.visualAlt} className="pum-pack-bob" style={{ width: 120, height: 'auto', filter: 'drop-shadow(0 18px 26px rgba(13,30,58,.22))' }} />
                </Parallax>
              )
              : <PumImg src="/assets/brand/mark-corn-u-trans.png" widths={[200, 400]} sizes="180px" width={600} height={900} alt={S.visualAlt} className="pum-pack-bob" style={{ width: '46%', maxWidth: 180, height: 'auto', filter: 'drop-shadow(0 18px 26px rgba(13,30,58,.22))' }} />}
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: mobile ? 12 : 13, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--flv-fresa)' }}>{S.eyebrow}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: mobile ? 30 : 'clamp(28px,3.6vw,44px)', color: 'var(--pum-navy)', lineHeight: 1.03, margin: '10px 0 14px' }}>{S.headline1}<br />{S.headline2}</h2>
            <p style={{ fontSize: mobile ? 15.5 : 17, lineHeight: 1.55, color: 'var(--fg-soft)', maxWidth: mobile ? 'none' : 440, fontWeight: 500, margin: '0 0 10px' }}>{S.p1}</p>
            <a href={LINKS.marca.nosotros} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: mobile ? 15 : 15.5, color: 'var(--pum-navy)', textDecoration: 'none', borderBottom: '3px solid var(--pum-corn)', paddingBottom: 2 }}>{S.link1} <Icon name="arrow-right" size={16} stroke={2.6} /></a>
            <p style={{ fontSize: mobile ? 15.5 : 17, lineHeight: 1.55, color: 'var(--fg-soft)', maxWidth: mobile ? 'none' : 440, fontWeight: 500, margin: '18px 0 10px' }}>{S.p2}</p>
            <a href={LINKS.marca.ingredientes} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: mobile ? 15 : 15.5, color: 'var(--pum-navy)', textDecoration: 'none', borderBottom: '3px solid var(--pum-corn)', paddingBottom: 2 }}>{S.link2} <Icon name="arrow-right" size={16} stroke={2.6} /></a>
          </div>
        </div>
        <div style={mobile
          ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px 14px', marginTop: 36 }
          : { display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap', marginTop: 46 }}>
          {S.benefits.map((b, i) => (
            <a key={i} href={LINKS.marca[b.linkKey]} className="pum-benefit" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: mobile ? 'auto' : 130, textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>
              <div className="pum-benefit-ic" style={{ width: mobile ? 60 : 64, height: mobile ? 60 : 64, borderRadius: '50%', border: '2px solid var(--pum-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pum-navy)', transition: 'background .15s,color .15s,transform .15s' }}><Icon name={b.icon} size={mobile ? 26 : 28} stroke={2} /></div>
              <div style={{ fontWeight: 800, fontSize: 12, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--pum-navy)', lineHeight: 1.3 }}>{b.line1}<br />{b.line2}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
