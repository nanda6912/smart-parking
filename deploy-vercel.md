# Vercel Deployment Guide

## Prerequisites
- Node.js installed
- Vercel account (free at vercel.com)
- Git repository (already initialized)

## Method 1: Vercel CLI (Recommended)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```
- Follow the prompts to login with your Vercel account
- Choose your authentication method (GitHub, GitLab, Email)

### 3. Build the Application
```bash
npm run build
```

### 4. Deploy to Vercel
```bash
vercel --prod
```
- First time: It will ask for project settings
- Project name: smart-parking (or your choice)
- Framework: Create React App (auto-detected)
- Build directory: build (auto-detected)
- Deploy to Production: Yes

### 5. Save Configuration
- When asked "Want to override the settings?", choose Yes
- This creates `vercel.json` configuration file

## Method 2: Vercel Web Dashboard

### 1. Push to GitHub First
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Choose "Import Git Repository"
4. Select your GitHub repository
5. Vercel will auto-detect:
   - Framework: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### 3. Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://smart-parking.vercel.app`

## Environment Variables (if needed)
If you need environment variables:
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add variables like:
   - `REACT_APP_API_URL` (if using external API)
   - `REACT_APP_ENVIRONMENT` (production/development)

## Custom Domain (Optional)
1. In Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

## Automatic Deployments
Once connected to GitHub:
- Every push to main branch triggers automatic deployment
- Preview deployments for pull requests
- Rollback to previous versions available

## Troubleshooting

### Build Errors
- Check `package.json` has correct scripts
- Ensure all dependencies are installed
- Check for syntax errors in components

### Deployment Issues
- Clear Vercel cache: `vercel --prod --force`
- Check build logs in Vercel dashboard
- Verify `vercel.json` configuration

### Performance
- Enable Vercel Analytics in dashboard
- Check Core Web Vitals
- Optimize images and assets if needed

## Post-Deployment Checklist
- [ ] Test all pages load correctly
- [ ] Test dark mode toggle
- [ ] Test booking flow
- [ ] Test exit processing
- [ ] Test admin dashboard
- [ ] Verify responsive design
- [ ] Check console for errors
- [ ] Test export functionality
- [ ] Verify PDF generation
