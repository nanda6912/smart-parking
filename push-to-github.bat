@echo off
echo Pushing SmartPark to GitHub...
echo.

echo Step 1: Adding all files...
git add .
echo.

echo Step 2: Committing changes...
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

echo.

echo Step 3: Pushing to GitHub...
git push origin main

echo.
echo ✅ SmartPark successfully pushed to GitHub!
echo.
echo Repository: https://github.com/nanda6912/smart-parking.git
pause
