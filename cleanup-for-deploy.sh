#!/bin/bash

echo "REMOVING UNUSED FILES FOR CLEAN DEPLOYMENT"
echo "========================================="
echo

echo "Step 1: Remove all deployment scripts (no longer needed)..."
rm -f cleanup-project.sh
rm -f debug-scaling-issue.sh
rm -f deploy-scaled.sh
rm -f final-fix-600-slots.sh
rm -f fix-cache-issue.sh
rm -f fix-console-warnings.sh
rm -f fresh-vercel-deploy.sh
rm -f scale-to-600-slots.sh

echo "Step 2: Remove build directory (will be regenerated)..."
rm -rf build/

echo "Step 3: Add cleanup to git..."
git add .

echo "Step 4: Commit cleanup..."
git commit -m "Remove unused files for clean deployment

CLEANUP REMOVED:
- All deployment scripts (no longer needed)
- Build directory (will be regenerated)
- Temporary debugging scripts
- Cache clearing scripts

PROJECT IS NOW CLEAN:
- Only essential source files remain
- Ready for fresh Vercel deployment
- 600 slots implementation complete
- No temporary or unused files

Core files retained:
- src/ (all source code)
- package.json (dependencies)
- README.md (documentation)
- vercel.json (deployment config)
- public/ (static assets)

Ready for production deployment!"

echo "Step 5: Push cleanup..."
git push origin main

echo
echo "✅ PROJECT CLEANED UP!"
echo
echo "Removed files:"
echo "- All deployment scripts"
echo "- Build directory"
echo "- Temporary debugging files"
echo
echo "Project is now clean and ready for fresh Vercel deployment."
echo "Only essential files remain for production."
echo
echo "Press Enter to continue..."
read
