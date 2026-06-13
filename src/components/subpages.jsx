/* /marca, /sabores intro and /preguntas-frecuentes page bodies.
   Deck-aligned (handoff v3): no placeholders, en-desarrollo framing, target nutrition
   table + footnote, waitlist CTAs. */
import React from 'react'
import { Icon, esValidation, PumImg, NutritionTable } from './ui.jsx'
import { FLAVORS, PAGES, NUTRITION, SITE, LINKS, STRINGS, WAITLIST } from '../lib/data.js'
import { submitForm, honeypotProps } from '../lib/forms.js'
import { Parallax } from '../lib/motion.jsx'

function SubHero({ hero }) {
  return (
    <section className="sub-hero">
      <div className="inner">
        <div>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.headline}</h1>
          <p>{hero.body}</p>
        </div>
        <div className="art"><Parallax fx={8} fy={6}><PumImg src={hero.art} widths={[200, 400, 800]} sizes={`${hero.artMaxWidth}px`} width={hero.art.includes('/packs/') ? 800 : 600} height={hero.art.includes('/packs/') ? 1028 : 900} alt={SITE.brand.name} style={{ maxWidth: hero.artMaxWidth, width: '78%', height: 'auto' }} /></Parallax></div>
      </div>
    </section>
  )
}

/* Closing band on content pages — the kept pre-launch lead capture: opens the
   "Avísame cuando salga" waitlist (ComingSoon) even with the store live, since the
   product isn't shipping yet (checkout itself is email capture). */
function CtaBand({ cta, onNotify }) {
  return (
    <section className="ctaband">
      <h2>{cta.headline}</h2>
      <p>{cta.body}</p>
      <button className="btn" onClick={() => onNotify && onNotify()}>{cta.button} <Icon name="bell" size={19} stroke={2.4} /></button>
    </section>
  )
}

export function NosotrosPage({ onNotify }) {
  const P = PAGES.nosotros
  return (
    <React.Fragment>
      <SubHero hero={P.hero} />
      <section className="block"><div className="wrap">
        <div className="split">
          <div>
            <h2 className="sec">{P.story.headline}</h2>
            {P.story.paras.map((t, i) => <p className="lead" key={i} style={{ marginBottom: 12 }}>{t}</p>)}
          </div>
          <div className="ph"><Icon name="image" size={34} /> Foto: fundador (próximamente)</div>
        </div>
      </div></section>
      <section className="block alt"><div className="wrap">
        <h2 className="sec">{P.compromisos.headline}</h2>
        <ul className="commit">
          {P.compromisos.items.map((it, i) => (
            <li key={i}><Icon name="check-circle-2" size={22} /><span>{it}</span></li>
          ))}
        </ul>
      </div></section>
      <section className="block"><div className="wrap">
        <h2 className="sec">{P.promesa.headline}</h2>
        <p className="lead">{P.promesa.body}</p>
      </div></section>
      <CtaBand cta={P.cta} onNotify={onNotify} />
    </React.Fragment>
  )
}

export function IngredientesPage({ onNotify }) {
  const P = PAGES.ingredientes
  return (
    <React.Fragment>
      <SubHero hero={P.hero} />
      <section className="block"><div className="wrap">
        <p className="lead" style={{ marginBottom: 22 }}>{P.intro}</p>
        <div className="split" style={{ alignItems: 'start' }}>
          <div>
            <h2 className="sec" style={{ fontSize: 'clamp(20px,3vw,26px)' }}>{P.statementTitle}</h2>
            <p className="lead" style={{ marginBottom: 16 }}>{P.statement}</p>
            <p className="lead" style={{ fontSize: 12.5, color: 'var(--fg-mute)' }}>*{P.footnote}</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, color: 'var(--pum-navy)', margin: '24px 0 8px' }}>{P.friendlyHeadline}</h3>
            <p className="lead">{P.friendly}</p>
          </div>
          <div>
            <h2 className="sec" style={{ fontSize: 'clamp(20px,3vw,26px)' }}>{P.nutritionHeadline}</h2>
            <NutritionTable data={NUTRITION} />
          </div>
        </div>
      </div></section>
      <section className="block alt"><div className="wrap">
        <h2 className="sec">{P.haveNot.headline}</h2>
        <ul className="commit">
          {P.haveNot.items.map((it, i) => (
            <li key={i}><Icon name="x-circle" size={22} style={{ color: '#E23D3D' }} /><span>{it}</span></li>
          ))}
        </ul>
      </div></section>
      <CtaBand cta={P.cta} onNotify={onNotify} />
    </React.Fragment>
  )
}

export function FaqPage({ onNotify }) {
  const P = PAGES.faq
  return (
    <React.Fragment>
      <SubHero hero={P.hero} />
      <section className="block"><div className="wrap" style={{ maxWidth: 760 }}>
        <dl style={{ margin: 0 }}>
          {P.items.map((it, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
              <dt style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, color: 'var(--pum-navy)', margin: '0 0 8px', lineHeight: 1.25 }}>{it.q}</dt>
              <dd style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-soft)', fontWeight: 500 }}>{it.a}</dd>
            </div>
          ))}
        </dl>
      </div></section>
      <CtaBand cta={STRINGS.waitlist && { headline: PAGES.nosotros.cta.headline, body: PAGES.nosotros.cta.body, button: PAGES.nosotros.cta.button }} onNotify={onNotify} />
    </React.Fragment>
  )
}

const fieldStyle = { width: '100%', fontFamily: 'var(--font-text)', fontWeight: 600, fontSize: 15, border: '2px solid var(--border-strong)', borderRadius: 14, padding: '13px 15px', color: 'var(--pum-navy)', background: '#fff' }
const labelStyle = { display: 'block', fontWeight: 800, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--fg-mute)', marginBottom: 6 }

export function ContactoPage() {
  const P = PAGES.contacto
  const [ok, setOk] = React.useState(false)
  const [error, setError] = React.useState(false)
  const onSubmit = async (e) => {
    e.preventDefault()
    setError(false)
    const form = e.target
    const { ok: sent } = await submitForm('contact', {
      nombre: form.nombre.value,
      email: form.email.value,
      mensaje: form.mensaje.value,
      empresa: form.empresa.value,
    })
    if (sent) {
      setOk(true)
      form.querySelectorAll('input,textarea').forEach((el) => { el.value = '' })
    } else setError(true)
  }
  return (
    <React.Fragment>
      <SubHero hero={P.hero} />
      <section className="block"><div className="wrap">
        <div className="split" style={{ alignItems: 'start' }}>
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>{P.form.nameLabel}</label>
              <input required {...esValidation('text')} name="nombre" placeholder={P.form.namePlaceholder} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>{P.form.emailLabel}</label>
              <input required type="email" {...esValidation('email')} name="email" placeholder={P.form.emailPlaceholder} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>{P.form.messageLabel}</label>
              <textarea required {...esValidation('text')} name="mensaje" rows={5} placeholder={P.form.messagePlaceholder} style={{ ...fieldStyle, resize: 'vertical' }} />
            </div>
            <input type="text" {...honeypotProps} />
            <button className="btn" type="submit" style={{ justifyContent: 'center' }}>{P.form.submit} <Icon name="send" size={20} stroke={2.4} /></button>
            {ok && <p style={{ color: '#2E9E5B', fontWeight: 700, margin: 0 }}>{P.form.success}</p>}
            {error && <p style={{ color: 'var(--danger)', fontWeight: 700, margin: 0 }}>{STRINGS.forms.submitError}</p>}
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div className="ic" style={{ margin: 0, flexShrink: 0 }}><Icon name="map-pin" size={22} /></div>
              <div><h3>{P.cards.addressTitle}</h3><p>{SITE.contact.addressLines[0]}<br />{SITE.contact.addressLines[1]}</p></div>
            </div>
            <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div className="ic" style={{ margin: 0, flexShrink: 0 }}><Icon name="phone" size={22} /></div>
              <div><h3>{P.cards.phoneTitle}</h3><p><a href={SITE.contact.phoneHref} style={{ color: 'var(--pum-navy)', fontWeight: 700 }}>{SITE.contact.phone}</a></p></div>
            </div>
            <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div className="ic" style={{ margin: 0, flexShrink: 0, borderColor: '#2E9E5B', color: '#2E9E5B' }}><Icon name="message-circle" size={22} /></div>
              <div><h3>{P.cards.whatsappTitle}</h3><p><a href={SITE.contact.whatsappHref} target="_blank" rel="noopener" style={{ color: '#2E9E5B', fontWeight: 800 }}>{P.cards.whatsappCta} →</a><br /><span style={{ color: 'var(--fg-mute)', fontSize: 13 }}>{SITE.contact.whatsapp}</span></p></div>
            </div>
            <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div className="ic" style={{ margin: 0, flexShrink: 0 }}><Icon name="mail" size={22} /></div>
              <div><h3>{P.cards.emailTitle}</h3><p><a href={`mailto:${SITE.contact.email}`} style={{ color: 'var(--pum-navy)', fontWeight: 700 }}>{SITE.contact.email}</a><br /><span style={{ color: 'var(--fg-mute)', fontSize: 13 }}>{P.cards.billingPrefix}{SITE.contact.billingEmail}</span></p></div>
            </div>
          </div>
        </div>
      </div></section>
    </React.Fragment>
  )
}
