# Mokhigh Expense Tracker

A single-user, mobile-first PWA for tracking personal expenses. Expenses are entered from an iPhone (installed as a home-screen app); dashboards and reports are reviewed on a laptop. Data syncs via Supabase with offline support via IndexedDB.

---

## Disclaimer

> **This software is provided for personal use only.**
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR THEREFOR.
>
> This tool does not constitute financial, accounting, tax, or legal advice. The author accepts no responsibility for financial decisions made based on data tracked or displayed by this application. You are solely responsible for the accuracy of your records and any actions taken as a result.

---

## Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with the required tables
- (Optional) A Vercel account for hosting

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/your-username/mokhigh-expense-tracker.git
cd mokhigh-expense-tracker
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Both values are found in your Supabase project under **Settings → API**.

### 3. Run the dev server

```bash
npm run dev
```

The dev server binds to all network interfaces, so you can open the app on your iPhone via your LAN IP (e.g. `http://192.168.x.x:5173`).

### 4. Install as a home-screen PWA (iPhone)

1. Open the app in Safari on your iPhone.
2. Tap the **Share** button (box with arrow).
3. Tap **Add to Home Screen**.
4. The app will behave like a native app with offline support.

---

## Adding an expense

1. Open the app and tap **Add** in the bottom navigation bar.
2. Fill in the amount, category, date, and an optional note.
3. Tap **Save**. The expense is saved locally first and synced to Supabase when online.

---

## Reviewing dashboards

Open the app on a laptop browser and navigate to the **Dashboard** tab to see spending breakdowns by category and time period.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (LAN-accessible) |
| `npm run build` | Production build |
| `npm run preview` | Serve the built app (tests PWA/SW behavior) |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |

---

## Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the Vercel project settings.
4. Deploy. Vercel auto-deploys on every push to `main`.

---

## Tech stack

| Layer | Technology |
|---|---|
| Build | Vite + React 18 |
| UI | MUI v6 |
| Animations | motion (motion/react) |
| Routing | react-router-dom |
| State | Zustand |
| Data / auth | Supabase |
| Offline cache | Dexie (IndexedDB) |
| PWA | vite-plugin-pwa (Workbox) |
| Hosting | Vercel |
