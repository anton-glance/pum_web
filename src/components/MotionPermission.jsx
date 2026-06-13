/* One-time iOS 13+ device-motion permission prompt (handoff doc 09 §2.3).
   Rendered only when DeviceOrientationEvent.requestPermission exists and hasn't been
   granted. Until granted (or if denied/dismissed) the touch-drag fallback is already
   live, so the page is never inert. Copy is the approved line — do not reword. */
import React from 'react'
import { PUM_TILT } from '../lib/motion.jsx'
import { Icon } from './ui.jsx'

export function MotionPermission() {
  const [visible, setVisible] = React.useState(false)
  React.useEffect(() => {
    // decide after mount (SSR-safe) and remember a dismissal for the session
    let dismissed = false
    try { dismissed = !!sessionStorage.getItem('pum_motion_dismissed') } catch { /* private mode */ }
    setVisible(PUM_TILT.needsPermission && !PUM_TILT.granted && !dismissed)
  }, [])
  if (!visible) return null
  const dismiss = () => {
    setVisible(false)
    try { sessionStorage.setItem('pum_motion_dismissed', '1') } catch { /* ignore */ }
  }
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 'calc(86px + env(safe-area-inset-bottom))', zIndex: 65, display: 'flex', justifyContent: 'center', pointerEvents: 'none', padding: '0 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'auto' }}>
        <button
          onClick={() => PUM_TILT.requestPermission().then(() => setVisible(false)).catch(dismiss)}
          style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, background: 'var(--pum-corn)', color: 'var(--pum-navy)', border: 'none', borderRadius: 999, padding: '13px 22px', cursor: 'pointer', boxShadow: '0 4px 0 var(--pum-corn-deep), 0 10px 24px rgba(13,30,58,.25)' }}>
          ¿Me dejas sentir el crunch?
        </button>
        <button onClick={dismiss} aria-label="Cerrar" style={{ background: 'var(--pum-cream)', border: '1px solid var(--border)', width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pum-navy)', boxShadow: '0 6px 16px rgba(13,30,58,.2)' }}>
          <Icon name="x" size={16} stroke={2.4} />
        </button>
      </div>
    </div>
  )
}
