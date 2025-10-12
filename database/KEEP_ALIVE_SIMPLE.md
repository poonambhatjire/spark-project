# 🎯 Keep-Alive Quick Reference

## ✅ What Was Created

1. **API Endpoint:** `src/app/api/keep-alive/route.ts`
2. **GitHub Workflow:** `.github/workflows/keep-alive.yml`
3. **Setup Guide:** `KEEP_ALIVE_SETUP.md` (in project root)

## 🚀 Quick Setup (2 Steps)

### Step 1: Deploy Your App
```bash
git add .
git commit -m "Add keep-alive system"
git push origin main
```

### Step 2: Add GitHub Secret
1. Go to: GitHub Repo → **Settings** → **Secrets and variables** → **Actions**
2. Click: **New repository secret**
3. Add:
   - Name: `KEEP_ALIVE_URL`
   - Value: `https://your-domain.vercel.app/api/keep-alive`

## ✨ That's It!

Your database will now stay active automatically:
- **Runs:** Every 6 hours (4x per day)
- **Activity:** 3 database queries per run
- **Cost:** $0 (completely free)
- **Maintenance:** Zero (fully automated)

## 🧪 Test It

```bash
# Test locally
curl http://localhost:3000/api/keep-alive

# Test production
curl https://your-domain.com/api/keep-alive
```

## 📊 Monitor It

GitHub → **Actions** tab → **Keep Supabase Database Active**

---

**Full documentation:** See `KEEP_ALIVE_SETUP.md` in project root

