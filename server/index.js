// ═══════════════════════════════════════════════════════════
//  Wellness Challenge — API server
//
//  Proxies chat requests to the Anthropic API so the key stays
//  on the server (process.env.ANTHROPIC_API_KEY) and is never
//  shipped to the browser.
//
//  Dev:        npm run dev      (runs this + Vite together)
//  Production: npm run build && npm start
// ═══════════════════════════════════════════════════════════
import 'dotenv/config'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT || 3001
const API_KEY = process.env.ANTHROPIC_API_KEY
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

if (!API_KEY) {
  console.warn(
    '\n⚠️  ANTHROPIC_API_KEY is not set.\n' +
    '   Copy .env.example to .env and add your key —\n' +
    '   the AI coach endpoint will return 503 until you do.\n'
  )
}

const app = express()
app.use(express.json({ limit: '1mb' }))

// ── Tiny in-memory rate limit: 20 requests / 5 min per IP ──
const WINDOW_MS = 5 * 60 * 1000
const MAX_REQ = 20
const hits = new Map()

function rateLimit(req, res, next) {
  const ip = req.ip ?? 'unknown'
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)

  if (recent.length >= MAX_REQ) {
    return res.status(429).json({ error: 'rate_limited' })
  }

  recent.push(now)
  hits.set(ip, recent)
  next()
}

// ── The coach persona ───────────────────────────────────────
function buildSystemPrompt(memberContext = {}) {
  const { name, points, streak, todaySummary } = memberContext

  return `أنتِ "المساعدة الذكية" في تطبيق Wellness Challenge الخاص بكوتش مشاعل — مدربة لياقة بدنية وأخصائية تغذية رياضية سعودية، جمهورها نساء وأمهات عربيات.

مهمتك:
- تشجيع العضوات على أعمدة التحدي الخمسة: الحركة 🚶، الماء 💧، اللياقة 🏋️، النوم 😴، التغذية 🌿.
- إجابات عملية قصيرة بالعربية البسيطة (لهجة سعودية خفيفة ومفهومة)، بأسلوب إيجابي محفّز وأنثوي المخاطبة.
- اقترحي خطوات صغيرة قابلة للتنفيذ اليوم، وربطي نصائحك بمستويات التحدي (برونز/فضة/ذهب) عند الإمكان.

حدود مهمة:
- لا تشخّصي حالات طبية ولا تصفي أدوية أو مكملات؛ وجّهي للطبيبة أو أخصائية التغذية عند أي مشكلة صحية أو إصابة أو حمل.
- لا تنصحي بحميات قاسية أو نقص سعرات شديد؛ التركيز على العادات المستدامة.
- إذا سُئلتِ عن شيء خارج الصحة والعافية، أجيبي باختصار لطيف وأعيدي التوجيه للتحدي.

${name ? `العضوة الحالية: ${name} — رصيدها ${points ?? 0} نقطة وسلسلتها ${streak ?? 0} يوم.` : ''}
${todaySummary ? `متابعتها اليوم: ${todaySummary}` : ''}

اجعلي كل إجابة موجزة (٣–٦ جمل غالباً) وودّية، ويمكن استخدام إيموجي باعتدال.`
}

// ── Validation helpers ──────────────────────────────────────
function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return null

  const cleaned = raw
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .slice(-20) // keep the last 20 turns max
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))

  if (cleaned.length === 0) return null
  if (cleaned[cleaned.length - 1].role !== 'user') return null
  return cleaned
}

// ── AI coach endpoint ───────────────────────────────────────
app.post('/api/coach', rateLimit, async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({ error: 'not_configured' })
  }

  const messages = sanitizeMessages(req.body?.messages)
  if (!messages) {
    return res.status(400).json({ error: 'bad_request' })
  }

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: buildSystemPrompt(req.body?.memberContext),
        messages,
      }),
    })

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '')
      console.error('Anthropic API error', upstream.status, detail.slice(0, 300))
      return res.status(502).json({ error: 'upstream_error' })
    }

    const data = await upstream.json()
    const reply = (data.content ?? [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim()

    res.json({ reply })
  } catch (err) {
    console.error('Coach endpoint failed:', err)
    res.status(500).json({ error: 'server_error' })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(API_KEY) })
})

// ── Serve the built frontend when dist/ exists ──────────────
const distDir = path.resolve(__dirname, '..', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
  console.log('Serving built frontend from dist/')
} else {
  console.log('dist/ not found — dev mode (frontend served by Vite on :5173)')
}

app.listen(PORT, () => {
  console.log(`API server → http://localhost:${PORT}`)
  console.log(`Model: ${MODEL} · Key: ${API_KEY ? '✓ set' : '✗ missing'}`)
})
