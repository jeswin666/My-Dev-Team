# AI Dev Team — Deployment Guide

A multi-agent AI dev team workspace powered by Claude. Describe any app or website and six specialists (PM, Backend Dev, DBA, Frontend Dev, Security Engineer, QA) plan it together and generate starter code files.

## Files in this repo

```
index.html      ← The full app (frontend)
api/chat.js     ← Secure Anthropic API proxy (Vercel serverless function)
package.json    ← Node.js config
vercel.json     ← Vercel deployment config
```

---

## Deploy in 5 steps

### Step 1 — Create a GitHub repository
1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click the **+** icon → **New repository**
3. Name it `ai-dev-team`
4. Set it to **Public**
5. Click **Create repository**
6. Upload all four files: `index.html`, `api/chat.js`, `package.json`, `vercel.json`
   - Click **uploading an existing file** → drag and drop all files → **Commit changes**

> **Note:** Make sure `api/chat.js` is inside a folder called `api`. GitHub lets you create folders by typing `api/chat.js` in the filename field when uploading.

---

### Step 2 — Create a Vercel account
1. Go to [vercel.com](https://vercel.com) and sign up **with your GitHub account**
2. Click **Continue with GitHub** and authorize Vercel

---

### Step 3 — Import your repo to Vercel
1. In Vercel dashboard, click **Add New → Project**
2. Find `ai-dev-team` in the list and click **Import**
3. Leave all settings as default
4. Click **Deploy** (it will fail at first — that's expected, you need the API key next)

---

### Step 4 — Add your Anthropic API key
1. Get your API key from [console.anthropic.com](https://console.anthropic.com) → **API Keys** → **Create Key**
2. In Vercel, go to your project → **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** paste your key (starts with `sk-ant-...`)
   - **Environment:** check Production, Preview, Development
4. Click **Save**

---

### Step 5 — Redeploy
1. Go to **Deployments** tab in Vercel
2. Click the three dots on the latest deployment → **Redeploy**
3. Wait ~30 seconds

Your app is now live at `https://ai-dev-team-[your-username].vercel.app` 🎉

---

## Making updates

Any time you push changes to GitHub, Vercel automatically redeploys within ~30 seconds.

---

## Cost

- **GitHub:** Free
- **Vercel:** Free tier (more than enough for personal use)
- **Anthropic API:** Pay per use (~$0.003–0.015 per full team planning session)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "ANTHROPIC_API_KEY not configured" | Add the env variable in Vercel Settings → Environment Variables |
| Blank page | Check Vercel Functions logs for errors |
| API returns 401 | Your API key is wrong or expired — regenerate at console.anthropic.com |
| Deployment fails | Check that `api/chat.js` is in a folder named exactly `api` |
