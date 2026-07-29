// ═══════════════════════════════════════════════════════════
//  Wellness Challenge — static server
//
//  The app talks to Supabase directly from the browser, so this
//  server has one job: serve the built frontend in production.
//
//  Dev:        npm run dev      (Vite serves the frontend)
//  Production: npm run build && npm start
// ═══════════════════════════════════════════════════════════
import 'dotenv/config'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001

const app = express()

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// ── Serve the built frontend when dist/ exists ──────────────
const distDir = path.resolve(__dirname, '..', 'dist')

if (fs.existsSync(distDir)) {
  // Hashed assets can be cached hard; index.html must not be.
  app.use(
    express.static(distDir, {
      setHeaders(res, filePath) {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache')
        }
      },
    })
  )
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
  console.log('Serving built frontend from dist/')
} else {
  console.log('dist/ not found — dev mode (frontend served by Vite on :5173)')
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
