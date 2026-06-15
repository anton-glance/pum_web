/* Subpage client entry — hydrates the prerendered HTML (dist) or mounts fresh (dev).
   The page id and (for /sabores) the flavor id come from data attributes on #root.

   ErrorBoundary is defined INLINE here (not imported from a shared module) on purpose:
   a shared import made Vite emit it as a second, separately-executing <script type=module>
   on the inner pages only (home got it as a modulepreload inside its single entry). That
   asymmetry — two entry scripts vs one — loads/hydrates fine in Chrome but can leave the
   inner-page tree non-interactive on iOS Safari. Inlining keeps each page on a single
   self-contained entry script, identical to the home page. */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import './styles/subpage.css'
import { SubpageApp } from './SubpageApp.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error, info) { try { console.error('[PUM] render error:', error, info) } catch { /* ignore */ } }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: '40px 24px', textAlign: 'center', fontFamily: 'var(--font-text, system-ui)', color: '#0D1E3A', background: '#FDF7F1' }}>
        <div style={{ fontFamily: 'var(--font-display, system-ui)', fontWeight: 800, fontSize: 26 }}>¡Ups! Algo se desmoronó 🌽</div>
        <p style={{ fontSize: 15, color: '#4A5568', fontWeight: 600, maxWidth: 380, margin: 0 }}>Tuvimos un problemita cargando esta parte. Vuelve a intentarlo en un momento.</p>
        <button onClick={() => { try { window.location.reload() } catch { /* ignore */ } }} style={{ fontFamily: 'var(--font-display, system-ui)', fontWeight: 800, fontSize: 16, background: '#F2B632', color: '#0D1E3A', border: 'none', borderRadius: 999, padding: '13px 26px', cursor: 'pointer', boxShadow: '0 4px 0 #d99e1c' }}>Recargar</button>
        <a href="/" style={{ fontSize: 13, color: '#0D1E3A', fontWeight: 700 }}>Volver al inicio</a>
      </div>
    )
  }
}

const container = document.getElementById('root')
const app = <ErrorBoundary><SubpageApp page={container.dataset.page} flavorId={container.dataset.flavor} /></ErrorBoundary>
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, app)
} else {
  const root = container._pumRoot || (container._pumRoot = ReactDOM.createRoot(container))
  root.render(app)
}
