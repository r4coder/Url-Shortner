# 🚀 Deployment Guide - Premium URL Shortener

Complete guide to deploy your authenticated URL shortener to Vercel.

---

## 🎯 Quick Deploy (5 Minutes)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit: URL shortener with auth"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Set Environment Variables in Vercel**
   
   In your Vercel project settings → Environment Variables, add:

   ```env
   TURSO_CONNECTION_URL=libsql://db-eeb7c7a6-288e-4667-872b-7ec773f77487-orchids.aws-us-west-2.turso.io
   TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjEzMjM5NDAsImlkIjoiOTE4MGE5MzYtNzIyYS00NjNlLWJkNjEtMmZhNjFiMTc4YWM3IiwicmlkIjoiNzYzYmNlMmItMWQ3ZC00NjMzLWIxODctYmNjYWRkOTg1ZWMyIn0.Ib1eHEV7zXQafaO2ILawonh5iu7Qgo2MR8_tq2hMa4W_Tl_yfB19LaH1X9radutr_O0sd_B7S0Cd5WcOfbhVDw
   BETTER_AUTH_SECRET=Zt+76PDplwek3XyjOiRzEIQKZM8K9bzbqhQZsRlFCd8=
   BETTER_AUTH_URL=https://your-app.vercel.app
   ```

   ⚠️ **Important**: Replace `https://your-app.vercel.app` with your actual Vercel deployment URL after first deployment.

4. **Redeploy** after setting BETTER_AUTH_URL
   - After first deployment, you'll get your URL (e.g., `your-app.vercel.app`)
   - Update the `BETTER_AUTH_URL` environment variable with this URL
   - Trigger a redeploy from Vercel dashboard

---

### Option 2: Deploy via Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and set environment variables when asked

# Deploy to production
vercel --prod
```

---

## 🔐 Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_CONNECTION_URL` | Your Turso database connection URL | ✅ Yes |
| `TURSO_AUTH_TOKEN` | Authentication token for Turso database | ✅ Yes |
| `BETTER_AUTH_SECRET` | Secret key for better-auth session encryption | ✅ Yes |
| `BETTER_AUTH_URL` | Full URL of your deployed application | ✅ Yes |

**All environment variables are already configured in your `.env` file!** Just copy them to Vercel.

---

## 📋 Pre-Deployment Checklist

✅ **Database**: Turso database is already set up and connected
✅ **Authentication**: better-auth is configured with login/register pages
✅ **API Routes**: All endpoints tested and working
✅ **Seeded Data**: Sample users and URLs are pre-loaded for testing

---

## 🎨 Features Deployed

### ✨ User Authentication
- **Login Page**: `/login` - Email/password authentication
- **Register Page**: `/register` - New user signup
- **Protected Routes**: Main app requires authentication
- **Session Management**: Secure token-based sessions

### 🔗 URL Shortener
- **Create URLs**: Shorten long URLs with unique codes
- **Track Clicks**: Monitor engagement on each link
- **Sort & Filter**: Multiple sorting options
- **User-Specific**: Each user sees only their URLs
- **Copy to Clipboard**: One-click URL copying

### 🎭 Premium Design
- **Glassmorphic UI**: Backdrop blur effects
- **Animated Background**: Gradient orbs
- **Black & White Buttons**: Clean, professional styling
- **Responsive**: Works on all devices

---

## 🧪 Testing Your Deployment

After deployment, test these flows:

1. **Registration**
   - Visit `/register`
   - Create a new account
   - Should redirect to login

2. **Login**
   - Visit `/login`
   - Sign in with credentials
   - Should redirect to main app

3. **Create Short URL**
   - Enter a long URL
   - Click "Shorten"
   - Verify URL appears in list

4. **Test Redirect**
   - Copy short URL
   - Open in new tab
   - Should redirect to original URL
   - Click count should increment

5. **Sign Out**
   - Click "Sign Out" button
   - Should redirect to login

---

## 🔧 Troubleshooting

### Issue: "BETTER_AUTH_URL is not defined"
**Solution**: Make sure you've set the `BETTER_AUTH_URL` environment variable to your Vercel deployment URL and redeployed.

### Issue: Authentication not working
**Solution**: 
1. Check that all environment variables are set in Vercel
2. Verify `BETTER_AUTH_SECRET` matches your .env file
3. Ensure `BETTER_AUTH_URL` uses HTTPS (not HTTP)
4. Redeploy after changing environment variables

### Issue: Database errors
**Solution**:
1. Verify `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are correct
2. Check Turso dashboard to ensure database is active
3. Run migrations if needed: `npm run db:push`

### Issue: URLs not loading
**Solution**:
1. Check browser console for errors
2. Verify you're logged in
3. Clear browser localStorage and try logging in again

---

## 📱 Your Deployed App URLs

After deployment, your app will have:

- **Main App**: `https://your-app.vercel.app/`
- **Login**: `https://your-app.vercel.app/login`
- **Register**: `https://your-app.vercel.app/register`
- **Short URLs**: `https://your-app.vercel.app/api/r/[shortCode]`

---

## 🎉 Success!

Your URL shortener is now live! Share your deployment URL and start shortening links.

### 🎁 Pre-loaded Test Data

Your database comes with sample data:
- **3 test users** with URLs
- **8 sample shortened URLs**
- Try logging in with test credentials or create your own account!

---

## 🚀 Next Steps

1. **Custom Domain** (Optional)
   - Go to Vercel project settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Analytics** (Optional)
   - Enable Vercel Analytics in project settings
   - Track page views and performance

3. **Monitoring**
   - Check Vercel logs for any errors
   - Monitor database usage in Turso dashboard

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Vercel deployment logs
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

---

**Built with**: Next.js 15, TypeScript, Turbo, Shadcn UI, better-auth, Drizzle ORM

**Database**: Turso (libSQL)

**Hosting**: Vercel