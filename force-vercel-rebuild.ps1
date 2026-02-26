Write-Host "Force Vercel Deployment - Aggressive Method" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Update package.json version to force rebuild..." -ForegroundColor Yellow
$json = Get-Content "package.json" | ConvertFrom-Json
$json.version = "0.1.1"
$json | ConvertTo-Json -Depth 10 | Set-Content "package.json"

Write-Host "Step 2: Add the version change..." -ForegroundColor Yellow
git add package.json

Write-Host "Step 3: Commit version bump..." -ForegroundColor Yellow
git commit -m "Bump version: 0.1.0 -> 0.1.1

Force Vercel to rebuild with latest changes:
- Two-page architecture (Entrance + Staff Panel)
- Combined ExitAdminPanel with tab navigation
- Real-time updates and auto-refresh functionality
- Production-ready build with no warnings
- Updated vercel.json for two-page structure"

Write-Host "Step 4: Push to trigger Vercel..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Version bump pushed to trigger Vercel!" -ForegroundColor Green
Write-Host ""
Write-Host "This forces Vercel to rebuild the entire application." -ForegroundColor Cyan
Write-Host "Check your site in 2-3 minutes:" -ForegroundColor Cyan
Write-Host "- Entrance: https://smart-parking-nine-rho.vercel.app/" -ForegroundColor White
Write-Host "- Staff Panel: https://smart-parking-nine-rho.vercel.app/panel" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
