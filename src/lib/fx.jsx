/* ¡PUM! — interactive FX engine (ported 1:1 from the approved mockup site/fx.jsx).
   Exposes: PUM_MOUSE, GooglyEye, GooglyMonster, CursorMascot, CrumbCanvas, pumBurst() */
import React from 'react'

export const PUM_MOUSE = {
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  y: typeof window !== 'undefined' ? window.innerHeight * 0.4 : 0,
  down: false,
  moved: 0,
}
if (typeof window !== 'undefined') {
  const set = (x, y) => { PUM_MOUSE.x = x; PUM_MOUSE.y = y; PUM_MOUSE.moved++ }
  window.addEventListener('mousemove', (e) => set(e.clientX, e.clientY), { passive: true })
  window.addEventListener('touchmove', (e) => { if (e.touches[0]) set(e.touches[0].clientX, e.touches[0].clientY) }, { passive: true })
}

/* Respect prefers-reduced-motion in the JS animation layer too (design-critique M7):
   no particle bursts, no crumb trail, no cursor mascot. Googly eyes keep ticking but
   the motion engine damps amplitudes (doc 09 §2.2). */
import { PUM_TILT } from './motion.jsx'

const REDUCED = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
/* Touch-first device (no hover): the mouse crumb-trail is suppressed (doc 09 §3.3). */
const TOUCH = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: none)').matches

/* ---------- Crumb particle system (canvas) ---------- */
const CRUMB_COLORS = ['#F2B632', '#FFD100', '#E39A12', '#FBCB55']
let _particles = []
export function pumBurst(x, y, opts = {}) {
  if (REDUCED) return
  const n = opts.count || 18
  const palette = opts.colors || CRUMB_COLORS
  const power = opts.power || 1
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const sp = (2 + Math.random() * 7) * power
    _particles.push({
      x, y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - (opts.up ? 4 * power : 2),
      g: 0.22 + Math.random() * 0.12,
      size: 5 + Math.random() * 9,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: palette[(Math.random() * palette.length) | 0],
      life: 1,
      decay: 0.008 + Math.random() * 0.01,
      round: Math.random() > 0.45,
    })
  }
  if (_particles.length > 900) _particles.splice(0, _particles.length - 900)
}

export function CrumbCanvas() {
  const ref = React.useRef()
  React.useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d')
    let raf
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    resize(); window.addEventListener('resize', resize)

    // crumb trail while moving fast
    let lastX = PUM_MOUSE.x, lastY = PUM_MOUSE.y, acc = 0, wasIdle = false
    const loop = () => {
      const dx = PUM_MOUSE.x - lastX, dy = PUM_MOUSE.y - lastY; const d = Math.hypot(dx, dy)
      // idle skip (design-critique M7): nothing alive and pointer still — skip painting entirely
      if (REDUCED || (_particles.length === 0 && d === 0)) {
        if (!wasIdle) { ctx.clearRect(0, 0, innerWidth, innerHeight); wasIdle = true }
        raf = requestAnimationFrame(loop)
        return
      }
      wasIdle = false
      acc += d; lastX = PUM_MOUSE.x; lastY = PUM_MOUSE.y
      // crumb trail is a cursor affordance — suppressed on touch devices (doc 09 §3.3);
      // pumBurst (tap-to-crunch) stays fully active there.
      if (!TOUCH && acc > 34) {
        acc = 0
        _particles.push({ x: PUM_MOUSE.x + (Math.random() - 0.5) * 10, y: PUM_MOUSE.y + (Math.random() - 0.5) * 10, vx: (Math.random() - 0.5) * 1.2, vy: Math.random() * 1.2, g: 0.14, size: 4 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.2, color: CRUMB_COLORS[(Math.random() * CRUMB_COLORS.length) | 0], life: 1, decay: 0.03, round: Math.random() > 0.5 })
      }
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      for (let i = _particles.length - 1; i >= 0; i--) {
        const p = _particles[i]
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= p.decay
        p.vx *= 0.99
        if (p.life <= 0 || p.y > innerHeight + 40) { _particles.splice(i, 1); continue }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.max(0, Math.min(1, p.life))
        ctx.fillStyle = p.color
        if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.size * 0.5, 0, 7); ctx.fill() }
        else { const w = p.size, h = p.size * 0.66, r = h * 0.5; ctx.beginPath(); ctx.moveTo(-w / 2 + r, -h / 2); ctx.arcTo(w / 2, -h / 2, w / 2, h / 2, r); ctx.arcTo(w / 2, h / 2, -w / 2, h / 2, r); ctx.arcTo(-w / 2, h / 2, -w / 2, -h / 2, r); ctx.arcTo(-w / 2, -h / 2, w / 2, -h / 2, r); ctx.fill() }
        ctx.restore()
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 9997, pointerEvents: 'none' }} />
}

/* ---------- Googly eye: the pupil rolls toward gravity (doc 09 §3.1) ----------
   Driven by PUM_TILT's projected gravity vector with the mockup's spring; on desktop
   the sim source maps the cursor onto the same vector so the feel is unchanged.
   No per-frame getBoundingClientRect — a real perf win with dozens of eyes on mobile. */
export function GooglyEye({ size = 34, pupil = 0.42, style }) {
  const pupRef = React.useRef()
  React.useEffect(() => {
    let x = 0, y = 0, vx = 0, vy = 0
    const max = size * (0.5 - pupil * 0.5) - 1
    return PUM_TILT.onTick((T) => {
      const len = Math.hypot(T.gx, T.gy) || 1
      const tx = (T.gx / len) * max, ty = (T.gy / len) * max
      vx += (tx - x) * 0.16; vy += (ty - y) * 0.16
      vx *= 0.8; vy *= 0.8; x += vx; y += vy
      if (pupRef.current) pupRef.current.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`
    })
  }, [size, pupil])
  const ps = size * pupil
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#fff', boxShadow: 'inset 0 -2px 4px rgba(0,0,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', ...style }}>
      <div ref={pupRef} style={{ width: ps, height: ps, borderRadius: '50%', background: '#0D1E3A' }}>
        <div style={{ width: ps * 0.32, height: ps * 0.32, borderRadius: '50%', background: '#fff', marginLeft: ps * 0.16, marginTop: ps * 0.16 }} />
      </div>
    </div>
  )
}

/* ---------- A little monster: flavor blob + googly eyes + smile ---------- */
export function GooglyMonster({ color = '#FF4B7D', size = 86, eye = 0.34, hair = '#0D1E3A', delay = 0, onPoke }) {
  const es = size * eye
  return (
    <div
      onClick={(e) => { if (onPoke) { const r = e.currentTarget.getBoundingClientRect(); pumBurst(r.left + r.width / 2, r.top + r.height * 0.3, { colors: [color, '#FFD100', '#fff'], count: 16, up: true }); onPoke(e) } }}
      className="pum-monster" style={{ width: size, height: size, position: 'relative', cursor: onPoke ? 'pointer' : 'default', animationDelay: delay + 's' }}>
      {/* hair tufts */}
      <div style={{ position: 'absolute', top: -size * 0.22, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: size * 0.06 }}>
        {[-18, -6, 8, 20].map((rot, i) => (<div key={i} style={{ width: size * 0.12, height: size * 0.3, borderRadius: size * 0.08, background: hair, transform: `rotate(${rot}deg)` }} />))}
      </div>
      {/* body */}
      <div style={{ width: size, height: size, borderRadius: '46% 46% 48% 48%/52% 52% 46% 46%', background: color, boxShadow: 'inset 0 -8px 14px rgba(0,0,0,.12), 0 8px 16px rgba(13,30,58,.18)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: size * 0.05 }}>
        <div style={{ display: 'flex', gap: size * 0.08 }}>
          <GooglyEye size={es} /><GooglyEye size={es} />
        </div>
        <div style={{ width: size * 0.3, height: size * 0.16, borderBottomLeftRadius: size * 0.3, borderBottomRightRadius: size * 0.3, background: '#0D1E3A' }} />
      </div>
    </div>
  )
}

/* ---------- Cursor-following mascot (U puff) ---------- */
export function CursorMascot() {
  const ref = React.useRef()
  React.useEffect(() => {
    if (REDUCED) { if (ref.current) ref.current.style.display = 'none'; return }
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) { if (ref.current) ref.current.style.display = 'none'; return } // touch devices
    let raf, x = PUM_MOUSE.x, y = PUM_MOUSE.y, px = x, py = y
    const loop = () => {
      x += (PUM_MOUSE.x - x) * 0.14; y += (PUM_MOUSE.y - y) * 0.14
      const vx = x - px, vy = y - py; px = x; py = y
      const sp = Math.min(1.6, Math.hypot(vx, vy) / 14)
      const ang = (Math.atan2(vy, vx) * 180) / Math.PI * 0.12
      const el = ref.current
      if (el) el.style.transform = `translate(${x + 22}px,${y + 22}px) rotate(${ang}deg) scale(${1 + sp * 0.12},${1 - sp * 0.1})`
      raf = requestAnimationFrame(loop)
    }
    loop(); return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <div ref={ref} style={{ position: 'fixed', top: -22, left: -22, zIndex: 9998, pointerEvents: 'none', willChange: 'transform' }}>
      <div className="pum-mascot-bob" style={{ width: 44, height: 44, position: 'relative' }}>
        <div style={{ width: 44, height: 44, borderRadius: '46% 46% 50% 50%/54% 54% 46% 46%', background: '#F2B632', boxShadow: 'inset 0 -6px 10px rgba(0,0,0,.14), 0 6px 12px rgba(13,30,58,.22)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <div style={{ display: 'flex', gap: 5, marginTop: 2 }}><GooglyEye size={13} /><GooglyEye size={13} /></div>
          <div style={{ width: 12, height: 6, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, background: '#0D1E3A' }} />
        </div>
      </div>
    </div>
  )
}
