/* Homepage client entry — hydrates the prerendered HTML (dist) or mounts fresh (dev).
   ErrorBoundary is inlined (not a shared import) so each page entry is fully self-contained
   and Vite never splits it into a separate executing <script> — see subpage.jsx for why. */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import { App } from './App.jsx'

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
const tree = <ErrorBoundary><App /></ErrorBoundary>
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, tree)
} else {
  const root = container._pumRoot || (container._pumRoot = ReactDOM.createRoot(container))
  root.render(tree)
}
