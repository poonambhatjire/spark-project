# Production Configuration Guide

## 🚨 **Critical: Fix localhost Redirect Issues**

Your Supabase emails are redirecting to `localhost:3000` instead of your production domain. Here's how to fix it:

## **1. Environment Variables**

Create a `.env.local` file in your project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site Configuration - CRITICAL FOR PRODUCTION
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# For development, use:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## **2. Supabase Dashboard Configuration**

Go to your Supabase Dashboard and update these settings:

### **Authentication → URL Configuration:**
- **Site URL**: `https://your-domain.com`
- **Redirect URLs**: 
  - `https://your-domain.com/auth/callback`
  - `https://your-domain.com/reset-password`
  - `https://your-domain.com/dashboard`

### **Authentication → Email Templates:**
- **Confirm signup**: Update redirect URL to use your domain
- **Reset password**: Update redirect URL to use your domain

## **3. Deployment Platform Configuration**

### **Vercel:**
Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`

### **Netlify:**
Add environment variables in Netlify dashboard:
- `NEXT_PUBLIC_SITE_URL` = `https://your-domain.com`

### **Other Platforms:**
Set the `NEXT_PUBLIC_SITE_URL` environment variable to your production domain.

## **4. Code Issues Found**

The following files have localhost fallbacks that need the environment variable:

1. **`src/lib/auth/supabase-actions.ts`** (Line 106)
   - Password reset emails
   
2. **`src/app/sitemap.ts`** (Line 4)
   - Sitemap generation
   
3. **`src/app/robots.ts`** (Line 4)
   - Robots.txt generation

## **5. Testing the Fix**

After setting the environment variables:

1. **Deploy your application**
2. **Test signup** - verification email should redirect to your domain
3. **Test password reset** - reset email should redirect to your domain
4. **Check sitemap** - should use your domain
5. **Check robots.txt** - should use your domain

## **6. Verification**

To verify the fix is working:

1. **Check environment variables** are set correctly
2. **Test signup flow** with a test email
3. **Verify email links** point to your domain, not localhost
4. **Check Supabase logs** for any redirect errors

## **7. Common Issues**

- **Environment variables not loaded**: Restart your development server
- **Still showing localhost**: Check if environment variable is set correctly
- **Supabase redirect errors**: Update Supabase dashboard settings
- **CORS errors**: Add your domain to Supabase allowed origins

## **8. Security Notes**

- Never commit `.env.local` to version control
- Use different environment variables for development and production
- Regularly rotate your Supabase keys
- Monitor Supabase logs for suspicious activity
