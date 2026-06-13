/* Homepage client entry — hydrates the prerendered HTML (dist) or mounts fresh (dev). */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import { App } from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'

const container = document.getElementById('root')
const tree = <ErrorBoundary><App /></ErrorBoundary>
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, tree)
} else {
  const root = container._pumRoot || (container._pumRoot = ReactDOM.createRoot(container))
  root.render(tree)
}
