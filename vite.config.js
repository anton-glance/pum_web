import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ isSsrBuild }) => ({
  // PUM_HTTPS=1 serves over self-signed HTTPS — needed on iPhone for the real
  // gyro (iOS exposes DeviceOrientationEvent only in secure contexts).
  plugins: [react(), ...(process.env.PUM_HTTPS ? [basicSsl()] : [])],
  appType: 'mpa',
  // allow tunnel hostnames (trycloudflare) when sharing the preview for device testing
  preview: { allowedHosts: true },
  build: {
    target: 'es2022', // top-level await in src/lib/data.js (runtime data load)
    ...(isSsrBuild
      ? { outDir: 'dist-ssr', ssr: true }
      : {
          rollupOptions: {
            input: {
              index: resolve(__dirname, 'index.html'),
              nosotros: resolve(__dirname, 'marca/nosotros.html'),
              ingredientes: resolve(__dirname, 'marca/ingredientes.html'),
              contacto: resolve(__dirname, 'marca/contacto.html'),
              'preguntas-frecuentes': resolve(__dirname, 'preguntas-frecuentes.html'),
              'sabor-churro': resolve(__dirname, 'sabores/churro.html'),
              'sabor-chocolate': resolve(__dirname, 'sabores/chocolate.html'),
              'sabor-jamaica': resolve(__dirname, 'sabores/jamaica.html'),
              'sabor-limon': resolve(__dirname, 'sabores/limon.html'),
              'aviso-de-privacidad': resolve(__dirname, 'legal/aviso-de-privacidad.html'),
              'terminos-y-condiciones': resolve(__dirname, 'legal/terminos-y-condiciones.html'),
            },
          },
        }),
  },
}))
