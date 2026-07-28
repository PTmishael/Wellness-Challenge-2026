# 🌿 Wellness Challenge — تحدي العافية

A standalone Arabic-first habit-challenge web app built for **Coach Mishael**'s community.
Members register, pick a daily tier for each of five health pillars, earn medals, and cheer
each other on in a WhatsApp-style chat.

Built with **React 18 + Vite**, backed by a **Supabase** (Postgres) database so members
share one set of data across every device. A small **Express** server serves the built
site in production.

---

## ✨ Features

| Area | What it does |
|---|---|
| **Authentication** | Register with name + password (avatar auto-assigned), log back in with name + password, separate admin login |
| **5 Pillars** | الحركة · الماء · اللياقة · النوم · التغذية — each with Bronze / Silver / Gold tiers |
| **Daily check-in** | One submission per day. Bronze = 1 pt, Silver = 2, Gold = 3 (max 15/day) |
| **Streaks & history** | Consecutive-day streak plus a rolling log of your last 7 days |
| **7 medals** | Auto-unlocked with a celebratory popup (first check-in, 3-day, 7-day, all-gold, 25 pts, 50 pts, 5 messages) |
| **Community chat** | WhatsApp-style bubbles with reply-to-message quoting, per-member notification bell (browser notifications, works across tabs of the same browser), pinned messages. Check-ins auto-post a multi-line summary |
| **Admin panel** | Member roster with search, capacity meter, inactive-member flags, delete accounts, edit/pin/delete any chat message |
| **Shared database** | Members and chat live in Supabase — sign in from any phone and your data follows you |
| **Ombre design** | Every screen is a seamless sand-to-basil gradient with a soft wave line — each of the 5 pillars gets its own color mood during check-in |
| **RTL + Arabic** | Full right-to-left layout, Tajawal typeface |

---

## 🚀 Getting started

**Requirements:** [Node.js](https://nodejs.org) 18 or newer.

```bash
# 1. Install dependencies
npm install

# 2. Start development (Vite on :5173 + API server on :3001, together)
npm run dev

# 4. Production build
npm run build

# 5. Run in production (serves the build AND the API from :3001)
npm start
```

> ℹ️ **This version has no AI features** — no API key, no Anthropic credits, and no
> per-message costs. The `.env` file and the `/api/coach` server endpoint remain in the
> codebase but are dormant; re-adding an AI tab later only requires a frontend component.

### Environment variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | For AI coach | — | Server-side key for the Anthropic API. **Never hardcoded, never sent to the browser.** |
| `ANTHROPIC_MODEL` | No | `claude-haiku-4-5-20251001` | Model used by the coach. Set `claude-sonnet-4-6` for richer answers at higher cost. |
| `PORT` | No | `3001` | API/production server port. |

---

## 🔐 Admin access

| Field | Value |
|---|---|
| Username | `Mishael` |
| Password | `wellness2025` |

Reach the admin login via the **دخول الإدارة** link at the bottom of the welcome screen.

> ⚠️ **Before deploying publicly, change these** in `src/constants/index.js`.
> This is client-side auth — it gates the admin *UI*, not the data. Anyone who opens
> devtools can read `localStorage`. That's an acceptable trade-off for a private community
> tool with no sensitive data; if you need real security, you need a backend (see below).

---

## 📁 Project structure

```
wellness-challenge/
├── index.html                 # HTML entry (RTL, fonts, PWA meta)
├── package.json
├── .env.example               # ⭐ copy to .env, add ANTHROPIC_API_KEY
├── vite.config.js             # dev proxy /api → :3001; set `base` for GH Pages
│
├── server/
│   └── index.js               # ⭐ Express: /api/coach proxy to Anthropic + rate limit
│                              #   Serves dist/ in production (npm start)
├── netlify.toml               # Netlify deploy config
├── vercel.json                # Vercel deploy config
│
├── public/                    # Static assets, copied as-is
│   ├── logo.png               # Coach Mishael "M" mark (original green)
│   ├── logo-white.png         # White variant, used on the green tile
│   ├── favicon.png
│   └── apple-touch-icon.png   # Home-screen icon
│
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Screen router + session restore
    │
    ├── constants/index.js     # ⭐ Pillars, tiers, medals, admin creds, member cap
    │
    ├── lib/
    │   ├── storage.js         # ⭐ localStorage layer — swap this for a real DB
    │   ├── medals.js          # Medal-award rules
    │   └── utils.js           # Dates, relative time, member factory
    │
    ├── components/
    │   ├── Logo.jsx           # Brand mark
    │   ├── Avatar.jsx         # Emoji avatar disc
    │   ├── BackgroundArt.jsx  # Animated SVG blobs
    │   ├── TopBar.jsx
    │   ├── BottomNav.jsx
    │   ├── MedalPopup.jsx
    │   └── ConfirmDialog.jsx
    │
    ├── screens/
    │   ├── Splash.jsx
    │   ├── Welcome.jsx
    │   ├── Register.jsx
    │   ├── Login.jsx
    │   ├── AdminLogin.jsx
    │   └── Home.jsx           # Owns all app state; renders the active tab
    │
    ├── tabs/
    │   ├── ChallengeTab.jsx   # Daily check-in + history
    │   ├── ChatTab.jsx        # Community chat
    │   ├── MedalsTab.jsx      # Trophy case
    │   └── MembersTab.jsx     # Admin-only roster
    │
    └── styles/index.css       # ⭐ All styling. Brand tokens at the top.
```

The three files marked ⭐ are where you'll make most changes.

---

## 🎨 Customising

### Change the pillars, tiers, or medals
Everything is data-driven from **`src/constants/index.js`**. Edit `PILLARS` to rename a
pillar or retune its Bronze/Silver/Gold targets — the UI updates automatically. Add a medal
by appending to `MEDALS` and adding its unlock rule in `src/lib/medals.js`.

### Change the member cap
```js
export const MAX_MEMBERS = 50   // src/constants/index.js
```

### Change the brand colours
All colours are CSS custom properties at the top of **`src/styles/index.css`**:
```css
--brand:      #37693D;   /* pulled from the logo */
--brand-dark: #1E3D21;
--brand-glow: #5C9463;
```

### Replace the logo
Drop your files into `public/` keeping the same names (`logo.png`, `logo-white.png`,
`favicon.png`, `apple-touch-icon.png`). No code change needed.

---

## 🌐 Deploying

Two pieces: a static frontend (`dist/`) and the small Node server. The AI coach
requires the server, so the simplest deployment is a **Node host running `npm start`**
(it serves both). Static-only hosting still works — everything except the coach tab.

### Node hosts (Render, Railway, Fly.io, any VPS) — recommended
1. Push the repo to GitHub.
2. Create a web service: build command `npm install && npm run build`, start command `npm start`.
3. Add the `ANTHROPIC_API_KEY` environment variable in the host's dashboard (never commit it).

Static-only options below (AI coach disabled unless you add a serverless function for `/api/coach`):

### Netlify
Push to GitHub, then "Import from Git" on Netlify. `netlify.toml` is already configured
(build `npm run build`, publish `dist`). Or drag-and-drop the `dist/` folder onto
[app.netlify.com/drop](https://app.netlify.com/drop).

### Vercel
```bash
npm i -g vercel
vercel
```
`vercel.json` is pre-configured.

### GitHub Pages
1. In `vite.config.js`, set the base to your repo name:
   ```js
   base: '/wellness-challenge/',
   ```
2. Build and publish:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

### Any other host / your own server
```bash
npm run build
# then upload the contents of dist/ anywhere that serves static files
```

---

## 🔑 How the API key stays safe

- The key lives in `.env` (gitignored) and is read by the server via `process.env.ANTHROPIC_API_KEY`.
- The browser only ever calls **our own** `/api/coach` endpoint; the server attaches the key
  and forwards to `https://api.anthropic.com/v1/messages`.
- The server validates message shape, caps history at 20 turns / 2,000 chars each, and
  rate-limits to 20 requests per 5 minutes per IP to protect your bill.
- The coach persona (Arabic, women-focused, tied to the five pillars, no medical diagnoses)
  is defined server-side in `server/index.js` → `buildSystemPrompt()` — members can't override it.

## 💾 How data is stored

Two Postgres tables in Supabase:

| Table | Contents |
|---|---|
| `members` | Every registered member: name, password, points, streak, medals, history, bio |
| `messages` | The community chat, newest first |

The only thing kept on the device is `wellness_challenge:session` in `localStorage` —
who is signed in on *this* phone, plus today's in-progress check-in before it's submitted.

The chat refreshes every 8 seconds, so members see each other's messages and check-ins
without reloading.

### Required environment variables

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | The anon/publishable key |

Set both in your host's dashboard (Render → Environment). Vite bakes `VITE_*` values in at
**build time**, so you must redeploy after changing them. If they're missing, the app shows
a clear setup notice instead of failing silently.

### Database schema

Run this once in Supabase → SQL Editor:

```sql
create table members (
  id text primary key,
  name text unique not null,
  password text,
  bio text default '',
  skin_index int default 0,
  color_index int default 0,
  points int default 0,
  streak int default 0,
  medals jsonb default '[]',
  check_ins int default 0,
  message_count int default 0,
  is_admin boolean default false,
  join_date text,
  last_active text,
  history jsonb default '[]'
);

create table messages (
  id text primary key,
  author_id text,
  author_name text,
  author_points int default 0,
  skin_index int default 0,
  color_index int default 0,
  is_admin boolean default false,
  text text,
  reply_to jsonb,
  pinned boolean default false,
  created_at timestamptz default now()
);

alter table members enable row level security;
alter table messages enable row level security;
create policy "open" on members for all using (true) with check (true);
create policy "open" on messages for all using (true) with check (true);
```

⚠️ Those policies leave the tables open to anyone who has the app URL and key. That's an
accepted trade-off for a small private community with no sensitive data. For anything
stricter you'd move to Supabase Auth with per-user policies.

## 📱 Installing on a phone

Open the deployed URL in Safari (iOS) or Chrome (Android) → **Share** → **Add to Home
Screen**. The app then launches fullscreen with the Coach Mishael logo as its icon.

---

## 📄 License

Private project for Coach Mishael's coaching community.
