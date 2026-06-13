/* /marca, /sabores intro and /preguntas-frecuentes page bodies.
   Deck-aligned (handoff v3): no placeholders, en-desarrollo framing, target nutrition
   table + footnote, waitlist CTAs. */
import React from 'react'
import { Icon, esValidation, PumImg, NutritionTable, RichText, inlineMd, MdTable } from './ui.jsx'
import { PAGES, NUTRITION, SITE, STRINGS } from '../lib/data.js'
import { submitForm, honeypotProps } from '../lib/forms.js'
import { Parallax } from '../lib/motion.jsx'

function SubHero({ hero }) {
  return (
    <section className="sub-hero">
      <div className="inner">
        <div>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.headline}</h1>
          <p>{inlineMd(hero.body, 'hero')}</p>
        </div>
        <div className="art"><Parallax fx={8} fy={6}><PumImg src={hero.art} widths={[200, 400, 800]} sizes={`${hero.artMaxWidth}px`} width={hero.art.includes('/packs/') ? 800 : 600} height={hero.art.includes('/packs/') ? 1028 : 900} alt={SITE.brand.name} style={{ maxWidth: hero.artMaxWidth, width: '78%', height: 'auto' }} /></Parallax></div>
      </div>
    </section>
  )
}

/* Captioned placeholder frame for [FOTO REAL] slots — no people/children generated;
   the brief stays visible so real photography can be dropped in later. */
function Placeholder({ caption }) {
  return <div className="ph"><Icon name="image" size={34} /><span>{caption}</span></div>
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
      {/* founder story + portrait placeholder */}
      <section className="block"><div className="wrap">
        <div className="split" style={{ alignItems: 'start' }}>
          <div>{P.story.paras.map((t, i) => <RichText key={i} as="p" className="lead" text={t} style={{ marginBottom: 14 }} />)}</div>
          <Placeholder caption={P.story.photo} />
        </div>
      </div></section>
      {/* el hueco + infographic */}
      <section className="block alt"><div className="wrap">
        <h2 className="sec">{P.hueco.headline}</h2>
        <p className="lead">{P.hueco.intro}</p>
        <ul className="commit">
          {P.hueco.items.map((it, i) => <li key={i}><Icon name="check-circle-2" size={22} /><span>{inlineMd(it, `hk${i}`)}</span></li>)}
        </ul>
        <div className="hueco-grid" role="img" aria-label={P.hueco.infographicNote}>
          {P.hueco.cards.map((c, i) => (
            <div className={`hueco-card${c.ok ? ' ok' : ''}`} key={i}>
              <Icon name={c.ok ? 'check-circle-2' : 'x-circle'} size={30} />
              <strong>{c.label}</strong>
              <span>{c.eq}</span>
            </div>
          ))}
        </div>
        <RichText as="p" className="lead" text={P.hueco.body} style={{ marginTop: 24 }} />
      </div></section>
      {/* mis compromisos */}
      <section className="block"><div className="wrap">
        <h2 className="sec">{P.compromisos.headline}</h2>
        <div className="compromisos">
          {P.compromisos.items.map((c, i) => (
            <div className="compromiso" key={i}>
              <div className="num" aria-hidden="true">{i + 1}</div>
              <div><h3>{c.title}</h3><RichText as="p" text={c.body} /></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 30, maxWidth: 760 }}><Placeholder caption={P.compromisos.photo} /></div>
      </div></section>
      {/* mi promesa */}
      <section className="block alt"><div className="wrap">
        <h2 className="sec">{P.promesa.headline}</h2>
        <p className="lead">{P.promesa.intro}</p>
        <ul className="commit">
          {P.promesa.items.map((it, i) => <li key={i}><Icon name="check-circle-2" size={22} /><span>{inlineMd(it, `pr${i}`)}</span></li>)}
        </ul>
      </div></section>
      {/* seguir el camino */}
      <section className="block"><div className="wrap">
        <h2 className="sec">{P.camino.headline}</h2>
        <RichText as="p" className="lead" text={P.camino.body} />
        <p className="footnote">{inlineMd(P.faqNote, 'fn')}</p>
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
        <Placeholder caption={P.infographicNote} />
        {P.sections.map((s, si) => (
          <div key={si} style={{ marginTop: 32 }}>
            <h2 className="sec" style={{ fontSize: 'clamp(20px,3vw,28px)' }}>{s.headline}</h2>
            <ul className="ing-list">
              {s.items.map((it, i) => <li key={i}><b>{it.term}</b> — {inlineMd(it.desc, `s${si}-${i}-`)}</li>)}
            </ul>
          </div>
        ))}
      </div></section>
      <section className="block alt"><div className="wrap">
        <h2 className="sec">{P.saborizantes.headline}</h2>
        <p className="lead">{P.saborizantes.intro}</p>
        <MdTable headers={P.saborizantes.headers} rows={P.saborizantes.rows} />
        <h2 className="sec" style={{ marginTop: 44 }}>{P.colorantes.headline}</h2>
        <p className="lead">{P.colorantes.intro}</p>
        <MdTable headers={P.colorantes.headers} rows={P.colorantes.rows} />
        <h2 className="sec" style={{ marginTop: 44 }}>{P.vitaminas.headline}</h2>
        <MdTable headers={P.vitaminas.headers} rows={P.vitaminas.rows} />
      </div></section>
      <section className="block"><div className="wrap">
        <h2 className="sec">{P.sinSellos.headline}</h2>
        <p className="lead">{P.sinSellos.intro}</p>
        <MdTable headers={P.sinSellos.headers} rows={P.sinSellos.rows} />
        <div style={{ marginTop: 44, maxWidth: 560 }}>
          <h2 className="sec" style={{ fontSize: 'clamp(20px,3vw,26px)' }}>{P.nutritionHeadline}</h2>
          <p className="lead" style={{ fontSize: 14, marginBottom: 14 }}>{P.nutritionNote}</p>
          <NutritionTable data={NUTRITION} />
        </div>
      </div></section>
      <section className="block alt"><div className="wrap">
        <h2 className="sec">{P.haveNot.headline}</h2>
        <ul className="commit no">
          {P.haveNot.items.map((it, i) => <li key={i}><Icon name="x-circle" size={22} /><span>{it}</span></li>)}
        </ul>
      </div></section>
      <section className="block"><div className="wrap">
        <h2 className="sec">{P.sabores.headline}</h2>
        <RichText as="p" className="lead" text={P.sabores.body} />
        <p className="footnote">{P.footnote}</p>
        <p className="footnote">{inlineMd(P.faqNote, 'fn')}</p>
      </div></section>
      <CtaBand cta={P.cta} onNotify={onNotify} />
    </React.Fragment>
  )
}

export function FaqPage({ onNotify }) {
  const P = PAGES.faq
  const dt = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, color: 'var(--pum-navy)', margin: '0 0 8px', lineHeight: 1.25 }
  const dd = { margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-soft)', fontWeight: 500 }
  return (
    <React.Fragment>
      <SubHero hero={P.hero} />
      <section className="block"><div className="wrap" style={{ maxWidth: 820 }}>
        {P.groups.map((g, gi) => (
          <div className="faq-group" key={gi} style={gi === 0 ? { marginTop: 0 } : undefined}>
            <h2 className="sec" style={{ fontSize: 'clamp(22px,3vw,30px)' }}>{g.headline}</h2>
            <dl style={{ margin: '8px 0 0' }}>
              {g.items.map((it, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
                  <dt style={dt}>{it.q}</dt>
                  <dd style={dd}>{inlineMd(it.a, `f${gi}-${i}-`)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        <p className="footnote">{P.footnote}</p>
      </div></section>
      <CtaBand cta={P.cta} onNotify={onNotify} />
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
