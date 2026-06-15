/* /marca + /preguntas-frecuentes page bodies — v2 redesign (design bundle KwRYq_PWU0hX22dNIKjqdQ).
   Shared page system in src/styles/subpage.css. Defaults baked in (cream hero, calm = no
   monsters, polaroid photos, bloque ingredients). Header/footer are the React Nav/Footer
   (out of scope). Copy comes from public/data/pages.json (source of truth). */
import React from 'react'
import { Icon, esValidation, PumImg, RichText, inlineMd, PrivacyShort } from './ui.jsx'
import { PAGES, SITE, STRINGS, LINKS } from '../lib/data.js'
import { submitForm, honeypotProps } from '../lib/forms.js'

/* ---- shared building blocks ---- */

// hero corner sticks: 5 imgs from the 3 stick assets, reused (p1..p5).
// Real intrinsic sizes (so the aspect ratio isn't squished to a square) — width comes from CSS.
const PUFFS = [
  { src: 'puff-long', w: 280, h: 125 },
  { src: 'puff-smile', w: 280, h: 119 },
  { src: 'puff-u', w: 280, h: 186 },
  { src: 'puff-smile', w: 280, h: 119 },
  { src: 'puff-long', w: 280, h: 125 },
]
function HeroDeco() {
  return (
    <div className="hero-deco" aria-hidden="true">
      {PUFFS.map((p, i) => (
        <PumImg key={i} src={`/assets/puffs/${p.src}.png`} widths={[180, 360]} sizes="84px" width={p.w} height={p.h} alt="" className={`puff p${i + 1}`} />
      ))}
    </div>
  )
}

// captioned photo placeholder (no drag-drop in prod) — never renders a person/child
function PhotoFrame({ kind = 'polaroid', cap, brief }) {
  return (
    <div className={`${kind === 'kids' ? 'kids-photo' : 'polaroid'} photo-frame`}>
      <div className="photo-window"><div className="photo-ph"><Icon name="image" size={30} /><span>{brief}</span></div></div>
      {cap && <span className="cap">{cap}</span>}
    </div>
  )
}

// inline waitlist email capture (submitForm; pre-launch simulates success)
function NotifyCard({ data, kind = 'newsletter' }) {
  const [done, setDone] = React.useState(false)
  const onSubmit = async (e) => {
    e.preventDefault()
    const { ok } = await submitForm(kind, { email: e.target.email.value, empresa: e.target.empresa.value })
    if (ok) setDone(true)
  }
  return (
    <div className="notify">
      <h2>{data.h2}</h2>
      <p>{data.body}</p>
      {done
        ? <p className="done">{data.done}</p>
        : (
          <form onSubmit={onSubmit}>
            <input type="email" name="email" required {...esValidation('email')} placeholder={data.placeholder} aria-label={data.placeholder} />
            <input type="text" {...honeypotProps} />
            <button type="submit">{data.submit}</button>
          </form>
        )}
      <p className="fine">{data.finePrefix}<a href={LINKS.legal.privacidad}>{data.fineLink}</a>.</p>
      <PrivacyShort tone="mute" align="center" />
    </div>
  )
}

function MoreQ({ data }) {
  return <div className="more-q"><p><span className="q">{data.q}</span> {data.body} <a href={LINKS.faq}>{data.link}</a>.</p></div>
}

// flavor cards (shared on nosotros + ingredientes) — links open the in-place ProductModal
const FLAVROW = [
  { id: 'jamaica', bg: '#FFE0F0', nm: 'Jamaica', ds: 'Flor crujiente' },
  { id: 'limon', bg: '#EDF4D9', nm: 'Limón', ds: 'Fresco y ácido' },
  { id: 'chocolate', bg: '#EFE3DA', nm: 'Chocolate', ds: 'Cacao cremosito' },
  { id: 'churro', bg: '#FFF4D6', nm: 'Churro', ds: 'Dulce y canelado' },
]
function FlavRow() {
  return (
    <div className="flavrow">
      {FLAVROW.map((f) => (
        <a key={f.id} className="flavcard" style={{ background: f.bg }} href={`/sabores/${f.id}.html`}>
          <span className="thumb"><PumImg src={`/assets/packs/pack-${f.id}.png`} widths={[200, 400]} sizes="92px" width={800} height={1028} alt={f.nm} /></span>
          <span className="nm">{f.nm}</span>
          <span className="ds">{f.ds}</span>
        </a>
      ))}
    </div>
  )
}

// branded table (ingredientes): cells may be markdown text or a {swatch,label} chip
function PumTable({ headers, rows }) {
  return (
    <div className="tbl-wrap">
      <table className="pum">
        <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => {
                if (c && typeof c === 'object' && c.swatch) {
                  return <td key={j}><span className="swatch"><span className="chip" style={{ background: c.swatch }} />{c.label}</span></td>
                }
                return <td key={j} className={headers[j] === 'Origen' ? 'origin' : undefined}>{inlineMd(c, `t${i}-${j}-`)}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ================= PARA PAPÁS (nosotros) ================= */
export function NosotrosPage() {
  const P = PAGES.nosotros
  return (
    <React.Fragment>
      <section className="hero hero-centered" data-screen-label="Hero">
        <HeroDeco />
        <div className="hero-simple center">
          <span className="eyebrow center">{P.hero.eyebrow}</span>
          <h1>{P.hero.h1}</h1>
          <p className="hero-sub">{P.hero.sub}</p>
          <p className="hero-intro">{P.hero.intro}</p>
          <div className="hero-cta">
            <a className="btn btn-secondary btn-lg" href={P.hero.ctaHref}>{P.hero.ctaLabel} <Icon name="arrow-right" size={18} stroke={2.5} /></a>
          </div>
          <div className="hero-art"><PhotoFrame cap={P.hero.photoCap} brief={P.hero.photoBrief} /></div>
        </div>
      </section>

      {/* Historia */}
      <section className="block" data-screen-label="Historia">
        <div className="story-grid">
          <PumImg src="/assets/brand/mark-corn-u-trans.png" widths={[200, 400]} sizes="120px" width={600} height={900} alt="La U de ¡PUM!" className="story-mark" />
          <div>
            <span className="eyebrow">{P.story.eyebrow}</span>
            <RichText as="p" className="lede" text={P.story.lede} />
            {P.story.paras.map((t, i) => <RichText key={i} as="p" text={t} />)}
          </div>
        </div>
      </section>

      {/* El hueco / fórmula */}
      <section className="block alt" data-screen-label="La fórmula">
        <div className="prose">
          <span className="eyebrow">{P.formula.eyebrow}</span>
          <h2>{P.formula.h2}</h2>
          <p>{P.formula.intro}</p>
          <div className="equation">
            <div className="eq-tile">
              <span className="ic" style={{ background: P.formula.tiles[0].icBg, color: P.formula.tiles[0].icColor }}><Icon name={P.formula.tiles[0].icon} size={28} /></span>
              <div className="t">{P.formula.tiles[0].t}</div><div className="d">{P.formula.tiles[0].d}</div>
            </div>
            <div className="eq-op">+</div>
            <div className="eq-tile">
              <span className="ic" style={{ background: P.formula.tiles[1].icBg, color: P.formula.tiles[1].icColor }}><Icon name={P.formula.tiles[1].icon} size={28} /></span>
              <div className="t">{P.formula.tiles[1].t}</div><div className="d">{P.formula.tiles[1].d}</div>
            </div>
            <div className="eq-op">=</div>
            <div className="eq-pum">
              <span className="spark">{P.formula.pum.spark}</span>
              <PumImg src="/assets/packs/pack-churro.png" widths={[200, 400]} sizes="108px" width={800} height={1028} alt="¡PUM!" />
              <div className="t">{P.formula.pum.t}</div><div className="d">{P.formula.pum.d}</div>
            </div>
          </div>
          <RichText as="p" text={P.formula.closing} style={{ marginTop: 28 }} />
        </div>
      </section>

      {/* Compromisos */}
      <section className="block" id="compromisos" data-screen-label="Compromisos">
        <div className="prose">
          <span className="eyebrow">{P.compromisos.eyebrow}</span>
          <h2>{P.compromisos.h2}</h2>
          <div className="commits">
            {P.compromisos.items.map((c, i) => (
              <div className="commit" key={i}>
                <div className="cic" style={{ background: c.color }}><Icon name={c.icon} size={26} stroke={2.3} /></div>
                <div><h3>{c.title}</h3><RichText as="p" text={c.body} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kids band */}
      <section className="block alt" data-screen-label="Para compartir">
        <div className="kids-band">
          <PhotoFrame kind="kids" brief={P.kids.photoBrief} />
          <div className="kids-copy">
            <span className="marker">{P.kids.marker}</span>
            <h3>{P.kids.h3}</h3>
            <p>{P.kids.body}</p>
          </div>
        </div>
      </section>

      {/* Promesa */}
      <section className="block soft" data-screen-label="Mi promesa">
        <div className="prose">
          <span className="eyebrow">{P.promesa.eyebrow}</span>
          <h2>{P.promesa.h2}</h2>
          <p>{P.promesa.intro}</p>
          <div className="promesa-card">
            <div className="promesa-row">
              {P.promesa.items.map((it, i) => (
                <div className="promesa-item" key={i}>
                  <div className="ic"><Icon name={it.icon} size={27} stroke={2.4} /></div>
                  <h3>{it.title}</h3><p>{it.body}</p>
                </div>
              ))}
            </div>
            <div className="promesa-sign"><span className="sig">{P.promesa.sig}</span><div className="who">{P.promesa.who}</div></div>
          </div>
        </div>
      </section>

      {/* Sabores + notify */}
      <section className="block" id="notify" data-screen-label="Sabores + aviso">
        <div className="prose">
          <span className="eyebrow">{P.sabores.eyebrow}</span>
          <h2>{P.sabores.h2}</h2>
          <p>{P.sabores.intro}</p>
          <FlavRow />
          <NotifyCard data={P.notify} kind="waitlist" />
        </div>
      </section>

      <MoreQ data={P.moreQ} />
    </React.Fragment>
  )
}

/* ================= INGREDIENTES ================= */
export function IngredientesPage() {
  const P = PAGES.ingredientes
  const SC = P.saborColor
  return (
    <React.Fragment>
      <section className="hero" data-screen-label="Hero">
        <HeroDeco />
        <div className="hero-simple hero-split">
          <div className="hero-copy">
            <span className="badge-dev"><Icon name="flask-conical" size={14} stroke={2.4} /> {P.hero.badge}</span>
            <h1>{P.hero.h1}</h1>
            <p className="hero-sub">{P.hero.sub}</p>
            <p className="hero-intro">{P.hero.intro}</p>
          </div>
          <div className="hero-art">
            <PumImg src={P.hero.pack} widths={[200, 400, 800]} sizes="240px" width={800} height={1028} eager fetchPriority="high" alt="Bolsa de ¡PUM! Churro" className="hero-pack pum-pack-bob" />
          </div>
        </div>
      </section>

      {/* Una bolsa, por dentro */}
      <section className="block" data-screen-label="La bolsa">
        <div className="prose">
          <span className="eyebrow">{P.bolsa.eyebrow}</span>
          <RichText as="p" className="lede" text={P.bolsa.lede} />
          <div className="bag-info">
            <div className="bag-col">
              {P.bolsa.left.map((c, i) => (
                <div className="callout" key={i}><span className="ct"><span className="dot" />{c.t}</span><span className="cd">{c.d}</span></div>
              ))}
            </div>
            <div className="bag-pack"><PumImg src={P.bolsa.pack} widths={[200, 400]} sizes="160px" width={800} height={1028} alt="Bolsa de ¡PUM! con sus componentes señalados" /></div>
            <div className="bag-col r">
              {P.bolsa.right.map((c, i) => (
                <div className="callout" key={i}><span className="ct">{c.t}<span className="dot" /></span><span className="cd">{c.d}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* La receta */}
      <section className="block alt" data-screen-label="La receta">
        <div className="prose">
          <span className="eyebrow">{P.receta.eyebrow}</span>
          <h2>{P.receta.h2}</h2>
          <div className="ingset">
            {P.receta.sections.map((s, si) => (
              <div className="ingsec" key={si}>
                <div className="ingsec-h"><span className="ingic"><Icon name={s.icon} size={22} /></span><h3>{s.h3}</h3></div>
                <ul className="ingl">
                  {s.items.map((it, i) => <li key={i}><b>{it.term}</b> <span>— {inlineMd(it.desc, `i${si}-${i}-`)}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sabor y color */}
      <section className="block" data-screen-label="Sabor y color">
        <div className="prose">
          <span className="eyebrow">{SC.eyebrow}</span>
          <div className="secgroup">
            <h2 className="ic-h2"><span className="h2ic"><Icon name={SC.saborizantes.icon} size={23} /></span> {SC.saborizantes.h2}</h2>
            <p style={{ marginTop: 10 }}>{SC.saborizantes.intro}</p>
            <PumTable headers={SC.saborizantes.headers} rows={SC.saborizantes.rows} />
          </div>
          <div className="secgroup">
            <h2 className="ic-h2"><span className="h2ic"><Icon name={SC.colorantes.icon} size={23} /></span> {SC.colorantes.h2}</h2>
            <p style={{ marginTop: 10 }}>{SC.colorantes.intro}</p>
            <PumTable headers={SC.colorantes.headers} rows={SC.colorantes.rows} />
          </div>
          <div className="secgroup">
            <h2 className="ic-h2"><span className="h2ic"><Icon name={SC.vitaminas.icon} size={23} /></span> {SC.vitaminas.h2}</h2>
            <p style={{ marginTop: 10 }}>{SC.vitaminas.body}</p>
          </div>
          <div className="secgroup">
            <h2 className="ic-h2"><span className="h2ic"><Icon name={SC.ligera.icon} size={23} /></span> {SC.ligera.h2}</h2>
            <div className="light-recipe"><p>{SC.ligera.body}</p></div>
          </div>
        </div>
      </section>

      {/* Lo que no llevará */}
      <section className="block alt" data-screen-label="Lo que no lleva">
        <div className="prose">
          <span className="eyebrow">{P.noLleva.eyebrow}</span>
          <h2 className="ic-h2"><span className="h2ic" style={{ background: 'rgba(226,61,61,.12)', color: 'var(--danger)', boxShadow: '0 4px 0 rgba(226,61,61,.22)' }}><Icon name="ban" size={23} /></span> {P.noLleva.h2}</h2>
          <ul className="nolist">
            {P.noLleva.items.map((it, i) => <li key={i}><span className="x"><Icon name="x" size={18} stroke={2.6} /></span> {it}</li>)}
          </ul>
        </div>
      </section>

      {/* Sabores + notify + disclaimer */}
      <section className="block" id="notify" data-screen-label="Sabores + aviso">
        <div className="prose">
          <span className="eyebrow">{P.sabores.eyebrow}</span>
          <h2>{P.sabores.h2}</h2>
          <FlavRow />
          <NotifyCard data={P.notify} kind="waitlist" />
          <div className="disclaimer-card"><Icon name="flask-conical" size={18} stroke={2.2} /><p>{P.disclaimer}</p></div>
        </div>
      </section>

      <MoreQ data={P.moreQ} />
    </React.Fragment>
  )
}

/* ================= PREGUNTAS FRECUENTES ================= */
export function FaqPage({ onNotify }) {
  const P = PAGES.faq
  return (
    <React.Fragment>
      <section className="hero" data-screen-label="Hero">
        <HeroDeco />
        <div className="hero-simple center">
          <span className="eyebrow center">{P.hero.eyebrow}</span>
          <h1>{P.hero.h1}</h1>
          <p className="hero-intro">{P.hero.intro}</p>
        </div>
      </section>

      <section className="faq" data-screen-label="Preguntas"><div className="prose">
        {P.groups.map((g, gi) => (
          <React.Fragment key={gi}>
            <div className="grouptitle"><span className="gic"><Icon name={g.icon} size={24} /></span><h2>{g.h2}</h2></div>
            <div className="qa">
              {g.items.map((it, i) => (
                <details className="q" key={i} open={gi === 0 && i === 0}>
                  <summary>{it.q} <span className="chev"><Icon name="chevron-down" size={20} stroke={2.6} /></span></summary>
                  <div className="ans">{inlineMd(it.a, `f${gi}-${i}-`)}</div>
                </details>
              ))}
            </div>
          </React.Fragment>
        ))}
        <p className="disclaimer">{P.disclaimer}</p>
      </div></section>

      <section className="block navy ctaband" data-screen-label="CTA">
        <h2>{P.cta.h2}</h2>
        <p>{P.cta.body}</p>
        <div className="btns">
          <a className="btn btn-primary btn-lg" href={`${LINKS.marca.nosotros}#notify`}>{P.cta.primary} <Icon name="bell" size={18} stroke={2.5} /></a>
          <a className="btn btn-ghost btn-lg" href={LINKS.marca.nosotros}>{P.cta.secondary} <Icon name="arrow-right" size={18} stroke={2.5} /></a>
        </div>
      </section>
    </React.Fragment>
  )
}

/* ================= CONTACTO (kept; updated to v2 hero/cards) ================= */
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
    const { ok: sent } = await submitForm('contact', { nombre: form.nombre.value, email: form.email.value, mensaje: form.mensaje.value, empresa: form.empresa.value })
    if (sent) { setOk(true); form.querySelectorAll('input,textarea').forEach((el) => { el.value = '' }) } else setError(true)
  }
  return (
    <React.Fragment>
      <section className="hero" data-screen-label="Hero">
        <HeroDeco />
        <div className="hero-simple center">
          <span className="eyebrow center">{P.hero.eyebrow}</span>
          <h1>{P.hero.h1}</h1>
          <p className="hero-intro">{P.hero.intro}</p>
        </div>
      </section>
      <section className="block"><div className="contact-grid">
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={labelStyle}>{P.form.nameLabel}</label><input required {...esValidation('text')} name="nombre" placeholder={P.form.namePlaceholder} style={fieldStyle} /></div>
          <div><label style={labelStyle}>{P.form.emailLabel}</label><input required type="email" {...esValidation('email')} name="email" placeholder={P.form.emailPlaceholder} style={fieldStyle} /></div>
          <div><label style={labelStyle}>{P.form.messageLabel}</label><textarea required {...esValidation('text')} name="mensaje" rows={5} placeholder={P.form.messagePlaceholder} style={{ ...fieldStyle, resize: 'vertical' }} /></div>
          <input type="text" {...honeypotProps} />
          <button className="btn btn-primary btn-md" type="submit" style={{ justifyContent: 'center' }}>{P.form.submit} <Icon name="send" size={18} stroke={2.4} /></button>
          {ok && <p style={{ color: '#2E9E5B', fontWeight: 700, margin: 0 }}>{P.form.success}</p>}
          {error && <p style={{ color: 'var(--danger)', fontWeight: 700, margin: 0 }}>{STRINGS.forms.submitError}</p>}
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card"><div className="ic"><Icon name="map-pin" size={22} /></div><div><h3>{P.cards.addressTitle}</h3><p>{SITE.contact.addressLines[0]}<br />{SITE.contact.addressLines[1]}</p></div></div>
          <div className="card"><div className="ic" style={{ borderColor: '#2E9E5B', color: '#2E9E5B' }}><Icon name="message-circle" size={22} /></div><div><h3>{P.cards.whatsappTitle}</h3><p><a href={SITE.contact.whatsappHref} target="_blank" rel="noopener" style={{ color: '#2E9E5B', fontWeight: 800 }}>{P.cards.whatsappCta} →</a></p></div></div>
          <div className="card"><div className="ic"><Icon name="mail" size={22} /></div><div><h3>{P.cards.emailTitle}</h3><p><a href={`mailto:${SITE.contact.email}`} style={{ color: 'var(--pum-navy)', fontWeight: 700 }}>{SITE.contact.email}</a></p></div></div>
        </div>
      </div></section>
    </React.Fragment>
  )
}
