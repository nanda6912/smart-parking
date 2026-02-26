@echo off
echo Triggering Vercel Redeployment...
echo.

echo Step 1: Creating a small change to trigger deployment...
echo. > trigger-deployment.txt

echo Step 2: Adding the trigger file...
git add trigger-deployment.txt

echo Step 3: Committing trigger...
git commit -m "Trigger Vercel deployment - latest two-page architecture

Forcing Vercel to redeploy with latest changes:
- Two-page architecture (Entrance + Staff Panel)
- Combined ExitAdminPanel with tab navigation
- Real-time updates and auto-refresh functionality
- Production-ready build with no warnings"

echo Step 4: Pushing to trigger Vercel...
git push origin main

echo Step 5: Cleaning up trigger file...
del trigger-deployment.txt
git add .
git commit -m "Clean up deployment trigger file"
git push origin main

echo.
echo ✅ Vercel deployment triggered!
echo.
echo Check your deployment at: https://vercel.com/dashboard
echo Live site: https://smart-parking-nine-rho.vercel.app/
echo Staff panel: https://smart-parking-nine-rho.vercel.app/panel
echo.
echo Note: Deployment may take 2-3 minutes to complete.
pause
