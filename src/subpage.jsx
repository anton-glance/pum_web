/* Subpage client entry — hydrates the prerendered HTML (dist) or mounts fresh (dev).
   The page id and (for /sabores) the flavor id come from data attributes on #root. */
import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import './styles/subpage.css'
import { SubpageApp } from './SubpageApp.jsx'

const container = document.getElementById('root')
const app = <SubpageApp page={container.dataset.page} flavorId={container.dataset.flavor} />
if (container.firstElementChild) {
  ReactDOM.hydrateRoot(container, app)
} else {
  const root = container._pumRoot || (container._pumRoot = ReactDOM.createRoot(container))
  root.render(app)
}
