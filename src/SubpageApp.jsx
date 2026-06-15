/* Shared shell for /marca, /sabores and /preguntas-frecuentes pages: chrome + in-place
   product modal + waitlist capture. Any a[href*="#sabor="] or a[href^="/sabores/"] click
   opens the SAME ProductModal in place (handoff doc 02 #2 + design-critique H3).
   Pre-launch (WAITLIST): no cart — buy CTAs open the waitlist (ComingSoon). */
import React from 'react'
import { FLAVORS, WAITLIST } from './lib/data.js'
import { useCart, cartStore, cartCount, cartTotal } from './lib/cart.js'
import { Nav } from './components/Nav.jsx'
import { Footer } from './components/Footer.jsx'
import { Cart, CartBar, ComingSoon } from './components/Cart.jsx'
import { NosotrosPage, IngredientesPage, ContactoPage, FaqPage } from './components/subpages.jsx'
import { SaborPage } from './components/SaborPage.jsx'

/* Lazy — see App.jsx. Keeps ProductModal out of the static graph so each subpage ships a
   SINGLE entry <script>. Vite was otherwise emitting the shared ProductModal chunk as a
   second executing module script on subpages only — harmless in Chrome, but it left the
   inner-page tree non-interactive on iOS Safari (menu/cart/cart-bar dead). */
const ProductModal = React.lazy(() => import('./components/ProductModal.jsx').then((m) => ({ default: m.ProductModal })))

const PAGES = { nosotros: NosotrosPage, ingredientes: IngredientesPage, contacto: ContactoPage, faq: FaqPage }

export function SubpageApp({ page, flavorId }) {
  const cart = useCart()
  const [detail, setDetail] = React.useState(null)
  const [open, setOpen] = React.useState(false)
  const [comingSoon, setComingSoon] = React.useState(false)
  const notify = () => setComingSoon(true)
  React.useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href*="#sabor="], a[href^="/sabores/"]')
      if (!a) return
      const href = a.getAttribute('href')
      const m = href.match(/sabor=([a-z]+)/i) || href.match(/\/sabores\/([a-z]+)(?:\.html)?/i)
      const f = m && FLAVORS.find((x) => x.id === m[1].toLowerCase())
      if (f && f.id !== flavorId) { e.preventDefault(); setDetail(f) }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [flavorId])
  const add = (f) => cartStore.add(f.id, f.delta === -1 ? -1 : 1)
  const remove = (f) => cartStore.remove(f.id)
  const Page = page === 'sabor' ? SaborPage : PAGES[page]
  return (
    <React.Fragment>
      <Nav variant="subpage" count={WAITLIST ? 0 : cartCount(cart)} onCart={WAITLIST ? undefined : () => setOpen(true)} onComingSoon={notify} />
      <main id="main">
        <Page flavorId={flavorId} onNotify={notify} />
      </main>
      <Footer onFlavor={setDetail} />
      {!WAITLIST && <CartBar cart={cart} total={cartTotal(cart, FLAVORS)} onOpen={() => setOpen(true)} onCheckout={() => setComingSoon(true)} />}
      {!WAITLIST && <Cart open={open} cart={cart} onClose={() => setOpen(false)} onAdd={add} onRemove={remove} onDelete={(f) => cartStore.delete(f.id)} onCheckout={() => { setOpen(false); setComingSoon(true) }} />}
      {detail && (
        <React.Suspense fallback={null}>
          <ProductModal
            flavor={detail}
            cart={cart}
            onClose={() => setDetail(null)}
            onAddToCart={(f, n) => cartStore.add(f.id, n)}
            onViewCart={() => { setDetail(null); setOpen(true) }}
            onNotify={() => { setDetail(null); notify() }}
          />
        </React.Suspense>
      )}
      <ComingSoon open={comingSoon} onClose={() => setComingSoon(false)} />
    </React.Fragment>
  )
}
