/* Cart module owning localStorage["pum_cart"] (handoff doc 06 R7, doc 02 contract).
   Schema: {"<flavorId>": qty} — int >= 1, key removed at 0. Shared by all pages. */
import { useSyncExternalStore } from 'react'
import { SITE } from './data.js'

const KEY = SITE.commerce.cartStorageKey

const EMPTY = {}
let cache = read()
const listeners = new Set()

function read() {
  if (typeof localStorage === 'undefined') return EMPTY // SSR
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function write(next) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — keep in-memory cart */
  }
  listeners.forEach((l) => l())
}

/* Pick up writes from other tabs/pages */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cache = read()
      listeners.forEach((l) => l())
    }
  })
}

export const cartStore = {
  get: () => cache,
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  add(id, n = 1) {
    const next = { ...cache }
    const q = (next[id] || 0) + n
    if (q <= 0) delete next[id]
    else next[id] = q
    write(next)
  },
  remove(id) {
    cartStore.add(id, -1)
  },
  /* Remove an item entirely regardless of quantity (drawer trash button). */
  delete(id) {
    const next = { ...cache }
    delete next[id]
    write(next)
  },
}

export function useCart() {
  // Server snapshot is always the empty cart; after hydration React re-reads the
  // client snapshot and re-renders cart chrome without a mismatch error.
  return useSyncExternalStore(cartStore.subscribe, cartStore.get, () => EMPTY)
}

export const cartCount = (cart) => Object.values(cart).reduce((s, n) => s + n, 0)
export const cartTotal = (cart, flavors) =>
  Object.keys(cart).reduce((s, id) => {
    const f = flavors.find((x) => x.id === id)
    return s + (f ? f.price * cart[id] : 0)
  }, 0)
