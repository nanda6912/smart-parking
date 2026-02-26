#!/bin/bash

echo "REMOVING UNNECESSARY FILES"
echo "=========================="
echo

echo "Step 1: Remove deployment scripts (no longer needed)..."
rm -f aggressive-vercel-trigger.sh
rm -f convert-to-spa.sh
rm -f fix-vercel-routing.sh
rm -f force-vercel-rebuild.bat
rm -f force-vercel-rebuild.ps1
rm -f force-vercel-rebuild.sh
rm -f push-to-github.bat
rm -f push-to-github.ps1
rm -f push-to-github.sh
rm -f trigger-vercel-deploy.bat
rm -f trigger-vercel-deploy.ps1
rm -f trigger-vercel-deploy.sh

echo "Step 2: Remove documentation files (no longer needed)..."
rm -f DEPLOYMENT-TROUBLESHOOTING.md
rm -f MANUAL-VERCEL-DEPLOY.md

echo "Step 3: Remove unused ExitAdminPanel component..."
rm -f src/pages/ExitAdminPanel.jsx

echo "Step 4: Add all removals to git..."
git add .

echo "Step 5: Commit cleanup..."
git commit -m "Remove unnecessary files - cleanup project structure

Removed:
- All deployment scripts (no longer needed)
- Troubleshooting documentation files
- ExitAdminPanel.jsx (replaced by separate pages)
- Temporary deployment trigger files

Project now has clean structure:
- Core application files only
- Three separate pages with navigation
- Production-ready SPA architecture
- No temporary or unused files"

echo "Step 6: Push cleanup to GitHub..."
git push origin main

echo
echo "✅ UNNECESSARY FILES REMOVED!"
echo
echo "Project structure is now clean and optimized."
echo "Only essential files remain for production."
echo "Press Enter to continue..."
read
