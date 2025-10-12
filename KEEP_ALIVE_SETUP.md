# 🚀 Keep-Alive Setup Guide

Your Supabase database keep-alive system has been configured! This guide will help you complete the setup.

## ✅ What's Already Done

1. **API Endpoint Created:** `/api/keep-alive`
   - Performs read operations on 3 database tables
   - Generates activity without modifying data
   - Returns success status and counts

2. **GitHub Actions Workflow Created:** `.github/workflows/keep-alive.yml`
   - Automatically pings your endpoint every 6 hours
   - Can be triggered manually
   - Includes error reporting

## 📋 Setup Steps

### Step 1: Deploy to Production

First, make sure your app is deployed to production (Vercel, Netlify, etc.)

```bash
# If using Vercel
vercel --prod

# Or commit and push to trigger auto-deployment
git add .
git commit -m "Add keep-alive endpoint and workflow"
git push origin main
```

### Step 2: Add GitHub Secret

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following:
   - **Name:** `KEEP_ALIVE_URL`
   - **Value:** `https://your-production-domain.com/api/keep-alive`
     - Example: `https://spark-project.vercel.app/api/keep-alive`

### Step 3: Test the Workflow

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Keep Supabase Database Active** workflow
4. Click **Run workflow** → **Run workflow**
5. Wait for it to complete (should take ~5 seconds)
6. Check the logs to verify success ✅

## 🔄 How It Works

### Automatic Schedule
- Runs every 6 hours: **00:00, 06:00, 12:00, 18:00 UTC**
- That's **4 times per day**
- Each run performs 3 database queries

### What Gets Generated
Each run:
- Counts records in `profiles` table
- Counts records in `time_entries` table  
- Counts records in `contact_submissions` table
- Total: **3 database operations per run**
- Daily: **12 database operations**

### Safety
- ✅ 100% read-only operations
- ✅ No data modification
- ✅ No data deletion
- ✅ Lightweight queries (count only, no data fetching)

## 🧪 Manual Testing

### Test Locally
```bash
curl http://localhost:3000/api/keep-alive
```

### Test Production
```bash
curl https://your-domain.com/api/keep-alive
```

Expected response:
```json
{
  "success": true,
  "timestamp": "2025-10-12T05:22:23.350Z",
  "message": "Database activity generated successfully",
  "activity": {
    "profiles": 11,
    "timeEntries": 38,
    "contacts": 0
  }
}
```

## 📊 Monitoring

### View Workflow Runs
1. Go to GitHub → **Actions** tab
2. See all past runs and their status
3. Click any run to see detailed logs

### Manual Trigger
If you want to run it immediately:
1. Go to **Actions** → **Keep Supabase Database Active**
2. Click **Run workflow**
3. Select branch (usually `main`)
4. Click **Run workflow**

## ⚙️ Customization

### Change Frequency

Edit `.github/workflows/keep-alive.yml`:

```yaml
# Every 4 hours
- cron: '0 */4 * * *'

# Every 12 hours
- cron: '0 */12 * * *'

# Once per day at 9 AM UTC
- cron: '0 9 * * *'
```

### Add More Activity

Edit `src/app/api/keep-alive/route.ts` to add more queries:

```typescript
// Add analytics query
const { data: recentEntries } = await supabase
  .from('time_entries')
  .select('id')
  .order('created_at', { ascending: false })
  .limit(10);
```

## 🎯 Benefits

✨ **Free Forever**
- No external services needed
- GitHub Actions is free for public repos
- Generous free tier for private repos

🔒 **Secure**
- Uses GitHub Secrets for URLs
- No credentials exposed
- Server-side execution only

📈 **Reliable**
- GitHub's infrastructure
- Automatic retries on failure
- Email notifications on errors (optional)

🚀 **Zero Maintenance**
- Set it and forget it
- Runs automatically forever
- No server needed

## ❓ Troubleshooting

### Workflow Not Running?
- Check that you've pushed the workflow file to GitHub
- Verify the file is in `.github/workflows/` directory
- Ensure you've added the `KEEP_ALIVE_URL` secret

### Workflow Failing?
- Check the Actions logs for error details
- Verify your production URL is correct
- Test the endpoint manually with curl

### Need Help?
Check the workflow logs in GitHub Actions for detailed error messages.

---

## 🎉 You're All Set!

Once you complete Step 2 (add the GitHub secret), your database will stay active automatically!

**Next Actions:**
1. ✅ Deploy to production
2. ✅ Add `KEEP_ALIVE_URL` secret to GitHub
3. ✅ Test the workflow manually
4. ✅ Relax - it runs automatically now! 🎊

