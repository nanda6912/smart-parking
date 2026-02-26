Write-Host "Triggering Vercel Redeployment..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Creating a small change to trigger deployment..." -ForegroundColor Yellow
" " | Out-File -FilePath "trigger-deployment.txt" -Encoding utf8

Write-Host "Step 2: Adding the trigger file..." -ForegroundColor Yellow
git add trigger-deployment.txt

Write-Host "Step 3: Committing trigger..." -ForegroundColor Yellow
git commit -m "Trigger Vercel deployment - latest two-page architecture

Forcing Vercel to redeploy with latest changes:
- Two-page architecture (Entrance + Staff Panel)
- Combined ExitAdminPanel with tab navigation
- Real-time updates and auto-refresh functionality
- Production-ready build with no warnings"

Write-Host "Step 4: Pushing to trigger Vercel..." -ForegroundColor Yellow
git push origin main

Write-Host "Step 5: Cleaning up trigger file..." -ForegroundColor Yellow
Remove-Item trigger-deployment.txt
git add .
git commit -m "Clean up deployment trigger file"
git push origin main

Write-Host ""
Write-Host "✅ Vercel deployment triggered!" -ForegroundColor Green
Write-Host ""
Write-Host "Check your deployment at: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "Live site: https://smart-parking-nine-rho.vercel.app/" -ForegroundColor Cyan
Write-Host "Staff panel: https://smart-parking-nine-rho.vercel.app/panel" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Deployment may take 2-3 minutes to complete." -ForegroundColor Yellow
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
