# 🚀 SkillFort LMS - Step-by-Step Deployment (FULLY AUTOMATED)

**Status**: All code ready ✅  
**Time Required**: ~20 minutes  
**Difficulty**: Easy (copy-paste)

---

## 📋 You Have Everything Ready:

✅ Frontend repo: `Kirubahar-Dev/skillfort-lms-frontend`  
✅ Backend repo: `Kirubahar-Dev/skillfort-lms-backend`  
✅ Supabase credentials: Already configured  
✅ Build: Production-ready  

---

## 🎯 PART 1: Deploy Frontend to Vercel (5 minutes)

### Step 1a: Create Vercel Account (if needed)
```
https://vercel.com/signup
Sign up with GitHub → Authorize → Done
```

### Step 1b: Deploy Frontend via Vercel Dashboard

**Fastest Method - Click & Done:**

1. Go to: https://vercel.com/new
2. Click **Import Git Repository**
3. Search for: `skillfort-lms-frontend`
4. Click **Import**
5. Vercel auto-detects it's a Vite project
6. Click **Deploy**
7. Wait 2-3 minutes ✨

**Your Frontend URL will be displayed:**
```
https://skillfort-lms-frontend.vercel.app
(or similar)
```

### Step 1c: Add Environment Variables

After deployment:

1. Go to Vercel Dashboard
2. Select: `skillfort-lms-frontend` project
3. Click: **Settings** → **Environment Variables**
4. Add these variables:

```
VITE_API_BASE_URL = https://skillfort-lms-backend.vercel.app/api/v1/lms
VITE_SUPABASE_URL = https://sfpvsbjtcbzafvjweaiu.supabase.co
VITE_SUPABASE_ANON_KEY = sfpvsbjtcbzafvjweaiu
```

5. Click **Save**
6. Go to **Deployments** → **Redeploy** latest
7. Wait for redeploy to complete

✅ **Frontend is now live!**

---

## 🎯 PART 2: Deploy Backend to Supabase (10 minutes)

### Step 2a: Access Your Supabase Project

Your Supabase Project ID: `sfpvsbjtcbzafvjweaiu`

**Option A: Create New Supabase Project (Recommended)**

1. Go to: https://supabase.com
2. Sign up or log in
3. Click **New Project**
4. Enter:
   - **Project Name**: skillfort-lms-backend
   - **Database Password**: Create strong password
   - **Region**: Choose closest to you
5. Click **Create New Project**
6. Wait 2-3 minutes for setup

### Step 2b: Deploy Backend Code

**Using Supabase Functions:**

1. In Supabase dashboard → **Functions** (left sidebar)
2. Click **Create a new function**
3. Name: `api`
4. Choose: **HTTP Request**
5. Replace the template code with your backend code from:
   ```
   /c/SKILLFORT/LMS/skillfort-lms-backend/app/main.py
   ```

**OR Better: Use Railway Instead (Easier for Python)**

### Alternative: Deploy to Railway (Simpler for Python Backend)

1. Go to: https://railway.app
2. Sign up with GitHub
3. Click **New Project**
4. **Deploy from GitHub repo**
5. Select: `Kirubahar-Dev/skillfort-lms-backend`
6. Railway auto-detects Python
7. Add environment variables:

```
DATABASE_URL = sqlite:///data/skillfort_lms.db
LMS_API_KEY = generate-random-key
JWT_SECRET = generate-jwt-secret
CORS_ORIGINS = https://skillfort-lms-frontend.vercel.app
```

8. Click **Deploy**
9. Wait for deployment
10. Copy the URL from Railway dashboard

**Your Backend URL will look like:**
```
https://skillfort-lms-backend.up.railway.app
```

✅ **Backend is now deployed!**

---

## 🎯 PART 3: Connect Frontend & Backend (5 minutes)

### Step 3a: Update Frontend with Backend URL

1. Get your backend URL from Railway/Supabase
2. Go to Vercel Dashboard
3. Select: `skillfort-lms-frontend`
4. **Settings** → **Environment Variables**
5. Update `VITE_API_BASE_URL`:

```
VITE_API_BASE_URL = https://your-backend-url/api/v1/lms
```

(Replace `your-backend-url` with actual URL)

6. Click **Save**
7. **Deployments** → **Redeploy**
8. Wait for redeploy

✅ **Frontend & Backend are now connected!**

---

## ✅ TEST YOUR DEPLOYMENT

### Test 1: Load Frontend
```
Open in browser: https://skillfort-lms-frontend.vercel.app
You should see:
✓ Homepage with hero section
✓ Dark/light theme toggle in header
✓ Course cards
✓ Navigation
```

### Test 2: Login
```
Click "Login" and enter:
Email: student@skillfort.com
Password: Student@123

You should see:
✓ Student Dashboard
✓ Enrolled courses
✓ Cart functionality
```

### Test 3: Test Dark Mode
```
Click sun/moon icon in header
Background should change to dark
Reload page
Dark mode should persist ✓
```

### Test 4: Test Backend
```
Visit backend docs:
https://your-backend-url/docs

You should see:
✓ Swagger UI
✓ All API endpoints
✓ Login endpoint works
```

---

## 🎉 Deployment Complete!

### Your Live URLs:
```
Frontend:    https://skillfort-lms-frontend.vercel.app
Backend:     https://skillfort-lms-backend.up.railway.app (or Supabase)
API Docs:    https://skillfort-lms-backend.up.railway.app/docs
Swagger:     https://skillfort-lms-backend.up.railway.app/openapi.json
```

### Test User Credentials:
```
Admin:
  Email: admin@skillfort.com
  Password: Admin@123

Instructor:
  Email: mentor@skillfort.com
  Password: Mentor@123

Student:
  Email: student@skillfort.com
  Password: Student@123
```

---

## 💰 Estimated Costs:

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | Unlimited ✓ | $0 |
| Railway | $5 credit | $0-10 |
| Supabase | 500MB DB | $0-25 |
| **Total** | | **$0-35/month** |

---

## 🚨 If Something Goes Wrong:

### Frontend Won't Deploy
```
Check Vercel logs:
1. Vercel Dashboard
2. Select project
3. Deployments → Click latest
4. Scroll down to "Build Logs"
5. Look for errors
```

### Can't Login
```
Check:
1. Backend URL correct in frontend env
2. Backend service is running
3. CORS_ORIGINS includes frontend URL
4. Database exists with test users
```

### Backend Won't Start
```
Check Railway/Supabase logs:
1. Railway: Deployments → View Logs
2. Look for Python errors
3. Ensure all dependencies in requirements.txt
```

---

## 📞 Support

- **Vercel**: https://vercel.com/help
- **Railway**: https://railway.app/support  
- **Supabase**: https://supabase.com/support
- **GitHub**: https://github.com/support

---

## ⏱️ Expected Timeline:

| Step | Time | Status |
|------|------|--------|
| 1. Deploy Frontend | 5 min | ⏳ |
| 2. Deploy Backend | 10 min | ⏳ |
| 3. Connect | 5 min | ⏳ |
| **Total** | **20 min** | ⏳ |

---

## 🎯 After Deployment (Optional)

### Custom Domain (Optional)
- Vercel: Settings → Domains → Add custom domain
- Railway: Settings → Custom Domain

### Monitoring (Optional)
- Vercel: Analytics tab
- Railway: Observability tab

### Security (Before Production)
- [ ] Remove test users
- [ ] Change JWT_SECRET
- [ ] Update CORS origins
- [ ] Set up environment backups
- [ ] Enable HTTPS (already on by default)
- [ ] Configure logging

---

**Status**: ✅ Ready to Deploy  
**Next Action**: Start with Part 1 above  
**Questions?** Check DEPLOYMENT_GUIDE.md for detailed troubleshooting

🚀 **Let's go!**
