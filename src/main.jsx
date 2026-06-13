/* Homepage client entry — hydrates the prerendered HTML (dist) or mounts fresh (dev). */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import { App } from './App.jsx'

const container = document.getElementById('root')
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, <App />)
} else {
  const root = container._pumRoot || (container._pumRoot = ReactDOM.createRoot(container))
  root.render(<App />)
}
