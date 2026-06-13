/* ¡PUM! — device-tilt motion engine (handoff doc 09 §2, ported 1:1 from mobile/tilt.jsx).
   Produces a continuous tilt signal sourced, in priority order, from:
     1. Real accelerometer/gyro (deviceorientation) when available + granted
     2. Touch-drag anywhere (finger replaces tilt)
     3. Mouse position (desktop simulation — keeps the effect reviewable on a laptop)
   Exposes smoothed tilt (sg/sb), a projected gravity vector (gx/gy) for the googly
   eyes, requestPermission() for iOS 13+, and onTick(fn) on ONE shared rAF loop. */
import React from 'react'

export const PUM_TILT = {
  gamma: 0, beta: 0,      // target tilt (deg): gamma = left/right, beta = offset from resting hold
  sg: 0, sb: 0,           // smoothed values
  gx: 0, gy: 0.64,        // gravity direction projected on the screen plane (unit-ish)
  source: 'sim',          // 'sim' | 'touch' | 'gyro'
  needsPermission: false,
  granted: false,
  REST_BETA: 40,          // assumed comfortable holding angle
  requestPermission: () => Promise.resolve('granted'),
  onTick: () => () => {},
}

if (typeof window !== 'undefined') {
  const T = PUM_TILT
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
  /* prefers-reduced-motion: keep ticking (eyes settle to resting gravity, pack sits
     flat) but damp the amplitudes (doc 09 §2.2). */
  const AMP = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.25 : 1

  /* simulated tilt: mouse position over the page */
  window.addEventListener('mousemove', (e) => {
    if (T.source === 'gyro') return
    const px = (e.clientX / window.innerWidth - 0.5) * 2
    const py = (e.clientY / window.innerHeight - 0.5) * 2
    T.gamma = px * 26 * AMP; T.beta = py * 20 * AMP
  }, { passive: true })

  /* touch-drag fallback: finger replaces tilt */
  window.addEventListener('touchmove', (e) => {
    if (T.source === 'gyro') return
    const t = e.touches[0]; if (!t) return
    const px = (t.clientX / window.innerWidth - 0.5) * 2
    const py = (t.clientY / window.innerHeight - 0.5) * 2
    T.gamma = px * 26 * AMP; T.beta = py * 20 * AMP; T.source = 'touch'
  }, { passive: true })

  /* real accelerometer */
  const onOri = (e) => {
    if (e.gamma == null && e.beta == null) return
    T.source = 'gyro'
    T.gamma = clamp(e.gamma || 0, -30, 30) * AMP
    T.beta = clamp((e.beta || 0) - T.REST_BETA, -24, 24) * AMP
  }
  T.needsPermission = typeof DeviceOrientationEvent !== 'undefined'
    && typeof DeviceOrientationEvent.requestPermission === 'function'
  if (typeof DeviceOrientationEvent !== 'undefined' && !T.needsPermission) {
    window.addEventListener('deviceorientation', onOri, { passive: true })
  }
  T.requestPermission = () => {
    if (!T.needsPermission) return Promise.resolve('granted')
    return DeviceOrientationEvent.requestPermission().then((res) => {
      if (res === 'granted') {
        T.granted = true
        window.addEventListener('deviceorientation', onOri, { passive: true })
      }
      return res
    })
  }

  /* one shared rAF tick for every motion consumer */
  const subs = new Set()
  T.onTick = (fn) => { subs.add(fn); return () => subs.delete(fn) }
  const tick = () => {
    T.sg += (T.gamma - T.sg) * 0.085
    T.sb += (T.beta - T.sb) * 0.085
    const gr = (T.sg * Math.PI) / 180
    const br = ((T.REST_BETA + T.sb) * Math.PI) / 180
    T.gx = Math.sin(gr)
    T.gy = Math.cos(gr) * Math.sin(br)
    T.ticks = (T.ticks || 0) + 1
    T.subCount = subs.size
    subs.forEach((f) => { try { f(T) } catch { /* keep ticking */ } })
  }
  const loop = () => { tick(); requestAnimationFrame(loop) }
  loop()
  T.step = tick // manual single tick — lets tests drive frames when rAF is suspended (hidden tab)
  window.PUM_TILT = T // inspection handle, mirrors the mockup's window export
}

/* ---------- Parallax wrapper: shifts children with the device tilt (doc 09 §4.1) ---------- */
export function Parallax({ fx = 10, fy = 8, rot = 0, style, children }) {
  const ref = React.useRef()
  React.useEffect(() => PUM_TILT.onTick((T) => {
    const nx = T.sg / 26, ny = T.sb / 20
    if (ref.current) ref.current.style.transform = `translate(${(nx * fx).toFixed(1)}px,${(ny * fy).toFixed(1)}px) rotate(${(nx * rot).toFixed(2)}deg)`
  }), [fx, fy, rot])
  return <div ref={ref} style={{ willChange: 'transform', ...style }}>{children}</div>
}

/* ---------- 3D pack tilt driven by the device tilt (doc 09 §4.2) ----------
   Tilts BOTH directions symmetrically — resting transform is just rotateZ(-3deg),
   no resting Y bias (brand-owner feedback, locked). */
export function PackTilt({ amp = 1, style, children }) {
  const ref = React.useRef()
  React.useEffect(() => PUM_TILT.onTick((T) => {
    if (ref.current) ref.current.style.transform =
      `rotateY(${(T.sg * 0.8 * amp).toFixed(1)}deg) rotateX(${(-T.sb * 0.7 * amp).toFixed(1)}deg) rotateZ(-3deg)`
  }), [amp])
  return (
    <div style={{ perspective: 900 }}>
      <div ref={ref} style={{ transform: 'rotateZ(-3deg)', transformStyle: 'preserve-3d', willChange: 'transform', ...style }}>{children}</div>
    </div>
  )
}

/* ---------- shared media-query hook ----------
   Server + first client render both return false (desktop), so hydration matches the
   prerendered HTML with no mismatch. The real value is applied in a LAYOUT effect —
   it runs after hydration commit but BEFORE the browser paints, so on a phone the
   desktop hero never actually shows: the swap to the mobile layout happens in the
   same frame. (useEffect would paint desktop first, then flash to mobile.) */
const useIsoLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect
export function useMediaQuery(query) {
  const [match, setMatch] = React.useState(false)
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(query)
    const f = () => setMatch(mq.matches)
    f()
    mq.addEventListener('change', f)
    return () => mq.removeEventListener('change', f)
  }, [query])
  return match
}

/* True on touch-first devices (no hover) — used to choose tilt-driven FX over mouse handlers. */
export function useTouchDevice() {
  return useMediaQuery('(hover: none)')
}
