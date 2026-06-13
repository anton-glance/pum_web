/* ¡PUM! image pipeline (design-critique H2).
   Source of truth: assets-src/ (drop a replacement with the same name, run `npm run images`).
   Output: public/assets/ — AVIF + WebP + PNG fallback, multiple widths for srcset.
   PumImg (src/components/ui.jsx) derives variant URLs by this naming convention:
     <base>-<width>.avif / .webp  +  <base>.png (largest width fallback). */
import { readdir, mkdir } from 'node:fs/promises'
import { join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, 'assets-src')
const OUT = join(ROOT, 'public/assets')

/* widths per asset family — largest ≈ 2× the biggest rendered size */
const FAMILIES = {
  packs: { widths: [200, 400, 800], png: 800, quality: { avif: 55, webp: 78 } },
  puffs: { widths: [180, 360], png: 360, quality: { avif: 60, webp: 80 } },
  logos: { widths: [200, 400], png: 400, quality: { avif: 60, webp: 85 } },
  brand: { widths: [300, 600], png: 600, quality: { avif: 55, webp: 80 } },
}

async function processFamily(family, cfg) {
  const dir = join(SRC, family)
  const outDir = join(OUT, family)
  await mkdir(outDir, { recursive: true })
  const files = (await readdir(dir)).filter((f) => /\.png$/i.test(f))
  for (const file of files) {
    const base = basename(file).replace(/\.png$/i, '').replace(/^u_separate$/, 'mark-u') // u_separate is the source of the U marks
    const input = sharp(join(dir, file))
    const meta = await input.metadata()
    for (const w of cfg.widths) {
      const width = Math.min(w, meta.width)
      await input.clone().resize({ width }).avif({ quality: cfg.quality.avif }).toFile(join(outDir, `${base}-${w}.avif`))
      await input.clone().resize({ width }).webp({ quality: cfg.quality.webp }).toFile(join(outDir, `${base}-${w}.webp`))
    }
    await input.clone().resize({ width: Math.min(cfg.png, meta.width) }).png({ compressionLevel: 9, palette: false }).toFile(join(outDir, `${base}.png`))
    console.log(`${family}/${base}: ${cfg.widths.length}×(avif+webp) + png@${cfg.png}`)
  }
}

/* brand U marks: the three mark files share u_separate.png as source */
async function brandMarks() {
  const src = join(SRC, 'brand/u_separate.png')
  const outDir = join(OUT, 'brand')
  await mkdir(outDir, { recursive: true })
  for (const name of ['mark-u', 'mark-u-trans', 'mark-corn-u-trans']) {
    const input = sharp(src)
    for (const w of [200, 400, 800]) {
      await input.clone().resize({ width: w }).avif({ quality: 55 }).toFile(join(outDir, `${name}-${w}.avif`))
      await input.clone().resize({ width: w }).webp({ quality: 80 }).toFile(join(outDir, `${name}-${w}.webp`))
    }
    await input.clone().resize({ width: 600 }).png({ compressionLevel: 9 }).toFile(join(outDir, `${name}.png`))
  }
  // reversed wordmark for legal headers (rendered 32px tall)
  const rev = sharp(join(SRC, 'brand/logo-corn-u-reversed.png'))
  for (const w of [200, 400]) {
    await rev.clone().resize({ width: w }).avif({ quality: 60 }).toFile(join(outDir, `logo-corn-u-reversed-${w}.avif`))
    await rev.clone().resize({ width: w }).webp({ quality: 85 }).toFile(join(outDir, `logo-corn-u-reversed-${w}.webp`))
  }
  await rev.clone().resize({ width: 400 }).png({ compressionLevel: 9 }).toFile(join(outDir, 'logo-corn-u-reversed.png'))
  console.log('brand marks regenerated from u_separate.png')
}

/* OG share image 1200×630: churro pack centered on brand cream */
async function ogImage() {
  const pack = await sharp(join(SRC, 'packs/pack-churro.png')).resize({ height: 560 }).toBuffer()
  const packMeta = await sharp(pack).metadata()
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: { r: 242, g: 182, b: 50, alpha: 1 } } })
    .composite([{ input: pack, top: 35, left: Math.round((1200 - packMeta.width) / 2) }])
    .jpeg({ quality: 85 })
    .toFile(join(ROOT, 'public/og-image.jpg'))
  console.log('og-image.jpg 1200×630 generated')
}

await processFamily('packs', FAMILIES.packs)
await processFamily('puffs', FAMILIES.puffs)
await processFamily('logos', FAMILIES.logos)
await brandMarks()
await ogImage()
console.log('done')
