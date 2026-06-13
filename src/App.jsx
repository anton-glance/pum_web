/* Homepage app — state, hash routing, splash sequencing (ported 1:1 from the approved mockup).
   Exported as a component so it can be server-rendered (entry-server.jsx) and hydrated (main.jsx).
   Pre-launch waitlist mode (WAITLIST): no cart/checkout — every buy CTA opens the waitlist
   (ComingSoon) capture instead. Set features.waitlist=false at launch to restore commerce. */
import React from 'react'
import { FLAVORS, WAITLIST } from './lib/data.js'
import { useCart, cartStore, cartCount, cartTotal } from './lib/cart.js'
import { CrumbCanvas, CursorMascot } from './lib/fx.jsx'
import { Nav } from './components/Nav.jsx'
import { Footer } from './components/Footer.jsx'
import { Hero, FlavorPlayground, CrunchZone, Story, EnDesarrollo } from './components/home.jsx'
import { Cart, CartBar, ComingSoon } from './components/Cart.jsx'
import { ProductModal } from './components/ProductModal.jsx'
import { MotionPermission } from './components/MotionPermission.jsx'

export function App() {
  const cart = useCart()
  const [open, setOpen] = React.useState(false)
  const [detail, setDetail] = React.useState(null)
  const [comingSoon, setComingSoon] = React.useState(false)
  const notify = () => setComingSoon(true)
  React.useEffect(() => {
    const cover = document.getElementById('pum-jump-cover')
    const reveal = () => { if (cover && cover.classList.contains('on') && !cover.classList.contains('fade')) { cover.classList.add('fade'); setTimeout(() => { cover.classList.remove('on', 'fade') }, 450) } }
    const scrollToId = (id) => { const el = document.getElementById(id); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 58; window.scrollTo({ top: Math.max(0, y) }) } }
    const handle = (retry) => {
      const h = location.hash || ''
      const m = h.match(/sabor=([a-z]+)/i)
      if (m) { const f = FLAVORS.find((x) => x.id === m[1].toLowerCase()); if (f) setDetail(f); reveal(); return }
      const id = h.replace('#', '')
      if (id === 'waitlist') { setComingSoon(true); reveal(); return }
      if (['flavors', 'crunch', 'story'].indexOf(id) >= 0) {
        scrollToId(id)
        if (retry) { [120, 320, 600].forEach((t) => setTimeout(() => scrollToId(id), t)); setTimeout(reveal, 680) }
      } else { reveal() }
    }
    setTimeout(() => handle(true), 40)
    window.addEventListener('load', () => setTimeout(reveal, 720))
    setTimeout(reveal, 1400)
    const onHash = () => handle(false)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const add = (f) => { cartStore.add(f.id, f.delta === -1 ? -1 : 1) }
  const remove = (f) => cartStore.remove(f.id)
  const count = cartCount(cart)
  const nav = (id) => {
    if (id === 'waitlist') { setComingSoon(true); return }
    const el = document.getElementById(id); if (el) { const y = el.getBoundingClientRect().top + window.scrollY - 60; window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }) }
  }
  return (
    <div>
      <CrumbCanvas />
      <CursorMascot />
      <Nav variant="home" count={WAITLIST ? 0 : count} onCart={WAITLIST ? undefined : () => setOpen(true)} onNav={nav} onComingSoon={notify} />
      <main id="main">
        <Hero onNav={nav} />
        {WAITLIST && <EnDesarrollo onNotify={notify} />}
        <FlavorPlayground cart={cart} onAdd={add} onOpen={setDetail} onNotify={notify} />
        <CrunchZone onOpen={setDetail} />
        <Story />
      </main>
      <Footer onFlavor={setDetail} />
      {!WAITLIST && <CartBar cart={cart} total={cartTotal(cart, FLAVORS)} onOpen={() => setOpen(true)} onCheckout={() => setComingSoon(true)} />}
      {!WAITLIST && <Cart open={open} cart={cart} onClose={() => setOpen(false)} onAdd={add} onRemove={remove} onDelete={(f) => cartStore.delete(f.id)} onCheckout={() => { setOpen(false); setComingSoon(true) }} />}
      <ProductModal
        flavor={detail}
        cart={cart}
        onClose={() => { setDetail(null); if (/sabor=/i.test(location.hash)) history.replaceState(null, '', location.pathname + location.search) }}
        onAddToCart={(f, n) => cartStore.add(f.id, n)}
        onViewCart={() => { setDetail(null); if (/sabor=/i.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); setOpen(true) }}
        onNotify={() => { setDetail(null); if (/sabor=/i.test(location.hash)) history.replaceState(null, '', location.pathname + location.search); notify() }}
      />
      <ComingSoon open={comingSoon} onClose={() => setComingSoon(false)} />
      <MotionPermission />
    </div>
  )
}
