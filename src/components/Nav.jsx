/* Sticky header — identical chrome on every page (handoff doc 02 contract #4).
   variant="home": transparent until scroll, in-page smooth scrolling (links keep real hrefs
   for crawlers/keyboard — design-critique M1). variant="subpage": solid cream bar.
   Includes the skip link (L1), the pre-launch ribbon (M4) and the mobile hamburger menu. */
import React from 'react'
import { Icon, Btn, PumImg, useFocusTrap } from './ui.jsx'
import { SITE, STRINGS, LINKS, PAGES } from '../lib/data.js'
import { useMediaQuery } from '../lib/motion.jsx'

function Ribbon({ onComingSoon }) {
  const [closed, setClosed] = React.useState(false)
  React.useEffect(() => {
    try { if (sessionStorage.getItem('pum_ribbon_closed')) setClosed(true) } catch { /* private mode */ }
  }, [])
  if (!SITE.features.prelaunchRibbon || closed) return null
  const R = STRINGS.ribbon
  return (
    <div style={{ background: 'var(--pum-navy)', color: 'var(--pum-cream)', textAlign: 'center', fontSize: 13.5, fontWeight: 700, padding: '8px 44px', position: 'relative' }}>
      <span>{R.text} </span>
      <button onClick={onComingSoon} style={{ background: 'none', border: 'none', color: 'var(--pum-corn)', fontWeight: 800, fontSize: 13.5, fontFamily: 'var(--font-text)', textDecoration: 'underline', cursor: 'pointer', padding: '6px 4px', margin: '-6px 0' }}>{R.cta}</button>
      <button onClick={() => { setClosed(true); try { sessionStorage.setItem('pum_ribbon_closed', '1') } catch { /* ignore */ } }} aria-label={R.closeAria} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--pum-cream)', opacity: 0.7, cursor: 'pointer', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="x" size={16} stroke={2.4} />
      </button>
    </div>
  )
}

/* Slide-in mobile menu sheet (handoff doc 09 §5, ported from the mockup MenuSheet):
   big section links, marca links, legal row, CTA at the bottom. Scrim/Esc close,
   body scroll locks while open, hit targets ≥44px. All labels come from data.js. */
function MenuSheet({ open, onClose, onSection, goHome, onComingSoon }) {
  const panelRef = React.useRef(null)
  useFocusTrap(panelRef, open)
  React.useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const k = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', k) }
  }, [open])
  const big = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', padding: '16px 4px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--pum-navy)', cursor: 'pointer', textAlign: 'left', textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }
  const mid = { ...big, fontSize: 17, padding: '13px 4px' }
  /* The primary nav now carries Ingredientes / Para Papás / FAQ, so drop any marca
     link that resolves to a page already in the header — avoids the duplicate rows. */
  const headerHrefs = new Set(SITE.navigation.header.filter((it) => it.href).map((it) => it.href))
  const M = STRINGS.footer.marcaLinks.filter((it) => {
    const href = LINKS.marca[it.linkKey] || LINKS[it.linkKey]
    return !headerHrefs.has(href)
  })
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 70, overflow: 'hidden', display: 'flex', justifyContent: 'flex-end', pointerEvents: open ? 'auto' : 'none' }} aria-hidden={!open}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13,30,58,.45)', opacity: open ? 1 : 0, transition: 'opacity .25s' }} />
      {/* Right-anchored via flexbox (justify-content:flex-end on the parent), NOT position:absolute
          right:0 — on iOS Safari `right:0` doesn't resolve on the panel's first paint, so it flashed
          on the LEFT for a frame before snapping right. Flex resolves the edge immediately. */}
      <aside ref={panelRef} role="dialog" aria-modal="true" aria-label="Menú" style={{ position: 'relative', width: '84%', maxWidth: 360, height: '100%', background: 'var(--pum-cream)', boxShadow: '-18px 0 44px rgba(13,30,58,.25)', transform: open ? 'translateX(0)' : 'translateX(105%)', transition: 'transform .3s cubic-bezier(.22,.61,.36,1)', willChange: 'transform', display: 'flex', flexDirection: 'column', padding: '24px 22px calc(26px + env(safe-area-inset-bottom))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <PumImg src={SITE.logos.onLight} widths={[200, 400]} sizes="80px" width={400} height={131} eager alt={SITE.brand.name} style={{ height: 26, width: 'auto', display: 'block' }} />
          <button onClick={onClose} aria-label={STRINGS.menu.closeAria} style={{ background: '#fff', border: '1px solid var(--border)', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pum-navy)' }}><Icon name="x" size={20} stroke={2.4} /></button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {SITE.navigation.header.map((it) => (
            it.href
              ? <a key={it.label} href={it.href} onClick={onClose} style={big}>{it.label} <Icon name="arrow-right" size={19} stroke={2.6} /></a>
              : <a key={it.label} href={goHome ? `/#${it.id}` : `${LINKS.home}#${it.id}`} onClick={(e) => onSection(e, it.id)} style={big}>{it.label} <Icon name="arrow-right" size={19} stroke={2.6} /></a>
          ))}
          {M.map((it) => (
            <a key={it.linkKey} href={LINKS.marca[it.linkKey] || LINKS[it.linkKey]} onClick={onClose} style={mid}>{it.label}</a>
          ))}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 18 }}>
            {PAGES.legal.map((l) => (
              <a key={l.slug} href={`/legal/${l.slug}.html`} onClick={onClose} style={{ fontSize: 12, color: 'var(--fg-mute)', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer', padding: '6px 0' }}>{l.title}</a>
            ))}
          </div>
        </div>
        <button onClick={() => { onClose(); onComingSoon && onComingSoon() }} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, background: 'var(--pum-corn)', color: 'var(--pum-navy)', border: 'none', borderRadius: 999, padding: '15px 28px', textAlign: 'center', marginTop: 18, boxShadow: '0 4px 0 var(--pum-corn-deep)', cursor: 'pointer' }}>{STRINGS.nav.quieroPum}</button>
      </aside>
    </div>
  )
}

export function Nav({ variant = 'home', count = 0, onCart, onNav, onComingSoon }) {
  const [sc, setSc] = React.useState(false)
  const [menuOpen, setMenuOpen] = React.useState(false)
  React.useEffect(() => {
    if (variant !== 'home') return
    const f = () => setSc(window.scrollY > 20)
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [variant])
  React.useEffect(() => {
    if (!menuOpen) return
    const k = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [menuOpen])
  const links = SITE.navigation.header
  const solid = variant !== 'home' || sc
  const goHome = variant === 'home'
  /* mobile header metrics from the approved mockup MobileNav: 18px gutters, 27px logo, 9px gaps */
  const mobile = useMediaQuery('(max-width: 720px)')
  const navClick = (id) => (e) => { if (goHome) { e.preventDefault(); onNav(id) } setMenuOpen(false) }
  const badge = count > 0 && (
    <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--flv-fresa)', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 12, minWidth: 21, height: 21, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--pum-cream)' }}>{count}</span>
  )
  const cartStyle = { position: 'relative', flexShrink: 0, boxSizing: 'border-box', background: 'var(--pum-navy)', color: 'var(--pum-cream)', border: 'none', width: 44, height: 44, minWidth: 44, padding: 0, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(13,30,58,.25)', lineHeight: 0 }
  const linkStyle = { cursor: 'pointer', fontWeight: 800, fontSize: 15, color: 'var(--pum-navy)', padding: '8px 13px', borderRadius: 999 }
  const logoImg = <PumImg src={SITE.logos.onLight} widths={[200, 400]} sizes={mobile ? '83px' : '92px'} width={400} height={131} eager alt={SITE.brand.name} style={{ height: mobile ? 27 : 30, width: 'auto', cursor: 'pointer', display: 'block' }} />
  return (
    <React.Fragment>
      <a className="pum-skip" href="#main">{STRINGS.skipLink}</a>
      <Ribbon onComingSoon={onComingSoon} />
      {/* solid-bar styling (bg/blur/border) lives in CSS keyed off data-solid so we can drop
          backdrop-filter on touch widths: a backdrop-filter on a position:sticky element breaks
          tap hit-testing in iOS Safari — it left the burger/cart buttons dead on inner pages
          (where the bar is solid from first paint). Mobile gets a near-opaque bar, no blur. */}
      <header className="pum-header" data-solid={solid ? '1' : '0'} style={{ position: 'sticky', top: 0, zIndex: 50, transition: 'background .25s,border-color .25s' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: mobile ? '9px 18px' : '13px 26px', display: 'flex', alignItems: 'center', gap: mobile ? 10 : 16, position: 'relative' }}>
          {goHome
            ? <a href="/" onClick={(e) => { e.preventDefault(); onNav('top') }} aria-label={SITE.brand.name}>{logoImg}</a>
            : <a href={LINKS.home} aria-label={SITE.brand.name}>{logoImg}</a>}
          <nav style={{ display: 'flex', gap: 4, marginLeft: 10 }} className="pum-navlinks" aria-label="principal">
            {links.map((it) => (
              it.href
                ? <a key={it.label} href={it.href} className="navlink" style={linkStyle}>{it.label}</a>
                : <a key={it.label} href={goHome ? `/#${it.id}` : `${LINKS.home}#${it.id}`} onClick={navClick(it.id)} className="navlink" style={linkStyle}>{it.label}</a>
            ))}
          </nav>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: mobile ? 9 : 11 }}>
            {onCart && (
              <button onClick={onCart} aria-label={STRINGS.nav.cartAria} style={cartStyle}>
                <Icon name="shopping-bag" size={19} />
                {badge}
              </button>
            )}
            <div className="hide-sm">
              <Btn onClick={() => (onComingSoon ? onComingSoon() : onNav(SITE.navigation.headerCta.id))}>{STRINGS.nav.quieroPum}</Btn>
            </div>
            <button className="pum-burger" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-label={menuOpen ? STRINGS.menu.closeAria : STRINGS.menu.openAria} style={{ background: solid ? '#fff' : 'rgba(253,247,241,.85)', border: '1.5px solid var(--border)', width: 44, height: 44, minWidth: 44, borderRadius: '50%', cursor: 'pointer', alignItems: 'center', justifyContent: 'center', color: 'var(--pum-navy)', padding: 0, boxShadow: '0 2px 8px rgba(13,30,58,.12)' }}>
              <Icon name="menu" size={21} stroke={2.4} />
            </button>
          </div>
        </div>
      </header>
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} goHome={goHome} onComingSoon={onComingSoon} onSection={(e, id) => { if (goHome) { e.preventDefault(); onNav(id) } setMenuOpen(false) }} />
    </React.Fragment>
  )
}
