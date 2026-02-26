Write-Host "Pushing SmartPark to GitHub..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Adding all files..." -ForegroundColor Yellow
git add .
Write-Host ""

Write-Host "Step 2: Committing changes..." -ForegroundColor Yellow
git commit -m "Update: Implement two-page architecture with Exit/Admin panel

- Combined Exit Counter and Admin Dashboard into single panel page
- Added tab navigation between Exit and Admin functions
- Updated App.js to use only two routes: / and /panel
- Fixed ESLint warnings and optimized build
- Updated vercel.json for two-page structure
- Removed unused files and cleaned up project structure

Features:
- Two-page architecture (Entrance + Staff Panel)
- Tab-based navigation in staff panel
- Real-time updates and auto-refresh
- Complete exit processing and admin analytics
- Production-ready build with no warnings"

Write-Host ""

Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ SmartPark successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "Repository: https://github.com/nanda6912/smart-parking.git" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
