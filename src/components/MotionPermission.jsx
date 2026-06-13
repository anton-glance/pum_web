/* One-time iOS 13+ device-motion permission prompt (handoff doc 09 §2.3).
   Shown only when DeviceOrientationEvent.requestPermission exists and hasn't been granted.
   Centered modal (the old bottom pill blended into the page) with a clear YES/NO choice.
   Until granted/denied/dismissed the touch-drag fallback is already live, so nothing is inert. */
import React from 'react'
import { PUM_TILT } from '../lib/motion.jsx'
import { Btn, PumImg, useFocusTrap } from './ui.jsx'
import { SITE } from '../lib/data.js'

export function MotionPermission() {
  const [visible, setVisible] = React.useState(false)
  const panelRef = React.useRef(null)
  useFocusTrap(panelRef, visible)
  React.useEffect(() => {
    let dismissed = false
    try { dismissed = !!sessionStorage.getItem('pum_motion_dismissed') } catch { /* private mode */ }
    setVisible(PUM_TILT.needsPermission && !PUM_TILT.granted && !dismissed)
  }, [])
  React.useEffect(() => {
    if (!visible) return
    const k = (e) => { if (e.key === 'Escape') dismiss() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [visible])
  if (!visible) return null
  const dismiss = () => {
    setVisible(false)
    try { sessionStorage.setItem('pum_motion_dismissed', '1') } catch { /* ignore */ }
  }
  const accept = () => PUM_TILT.requestPermission().then(() => setVisible(false)).catch(dismiss)
  return (
    <div onClick={dismiss} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(13,30,58,.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div ref={panelRef} role="dialog" aria-modal="true" aria-label="Activar el movimiento" onClick={(e) => e.stopPropagation()} style={{ width: 'min(360px,100%)', background: 'var(--pum-cream)', borderRadius: 26, overflow: 'hidden', boxShadow: '0 30px 70px rgba(13,30,58,.45)', textAlign: 'center' }}>
        <div style={{ background: 'var(--pum-corn)', padding: '24px 24px 18px', display: 'flex', justifyContent: 'center' }}>
          <PumImg src={SITE.logos.onLight} widths={[200, 400]} sizes="120px" width={400} height={131} alt={SITE.brand.name} className="pum-pack-bob" style={{ height: 40, width: 'auto', display: 'block', filter: 'drop-shadow(0 8px 14px rgba(13,30,58,.22))' }} />
        </div>
        <div style={{ padding: '22px 26px 26px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, color: 'var(--pum-navy)', margin: '0 0 8px', lineHeight: 1.05 }}>¿Jugamos con el movimiento?</h2>
          <p style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--fg-soft)', fontWeight: 600, margin: '0 0 22px' }}>Inclina tu teléfono y mira cómo ¡PUM! cobra vida: los monstruos te siguen y la bolsa se mueve. ¿Le entras?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Btn size="lg" onClick={accept} style={{ width: '100%', justifyContent: 'center' }}>¡Sí, vamos!</Btn>
            <Btn size="md" variant="ghost" onClick={dismiss} style={{ width: '100%', justifyContent: 'center' }}>Ahora no</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}
