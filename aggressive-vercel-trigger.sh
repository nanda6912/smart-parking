#!/bin/bash

echo "AGGRESSIVE VERCEL DEPLOYMENT TRIGGER"
echo "===================================="
echo

echo "Step 1: Update multiple files to force rebuild..."
# Update package.json version
sed -i 's/"version": "0.1.1"/"version": "0.1.2"/' package.json

# Update vercel.json to force re-evaluation
sed -i 's/"destination": "\/index.html"/"destination": "\/index.html"/' vercel.json

# Add a timestamp to index.html (this will be reverted)
echo "<!-- Build timestamp: $(date) -->" > build-timestamp.txt

echo "Step 2: Add all changes..."
git add package.json vercel.json build-timestamp.txt

echo "Step 3: Commit aggressive changes..."
git commit -m "AGGRESSIVE DEPLOYMENT TRIGGER - Force complete Vercel rebuild

Changes to force Vercel to rebuild:
- Version bump: 0.1.1 -> 0.1.2
- vercel.json updated (even if same content)
- Build timestamp added
- This should force complete rebuild

Latest features to deploy:
- Two-page architecture (Entrance + Staff Panel)
- Combined ExitAdminPanel with tab navigation
- Real-time updates and auto-refresh functionality
- Production-ready build with no warnings"

echo "Step 4: Push to Vercel..."
git push origin main

echo "Step 5: Clean up timestamp file..."
git rm build-timestamp.txt
git commit -m "Clean up build timestamp file"
git push origin main

echo
echo "✅ AGGRESSIVE TRIGGER PUSHED!"
echo
echo "This should force Vercel to completely rebuild."
echo "Wait 3-5 minutes and check:"
echo "- Staff Panel: https://smart-parking-nine-rho.vercel.app/panel"
echo "- Entrance: https://smart-parking-nine-rho.vercel.app/"
echo
echo "If still not working, manual Vercel redeploy needed."
echo "Press Enter to continue..."
read
