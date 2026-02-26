#!/bin/bash

echo "Force Vercel Deployment - Git Bash Version"
echo "=========================================="
echo

echo "Step 1: Update package.json version to force rebuild..."
sed -i 's/"version": "0.1.0"/"version": "0.1.1"/' package.json

echo "Step 2: Add the version change..."
git add package.json

echo "Step 3: Commit version bump..."
git commit -m "Bump version: 0.1.0 -> 0.1.1

Force Vercel to rebuild with latest changes:
- Two-page architecture (Entrance + Staff Panel)
- Combined ExitAdminPanel with tab navigation
- Real-time updates and auto-refresh functionality
- Production-ready build with no warnings
- Updated vercel.json for two-page structure"

echo "Step 4: Push to trigger Vercel..."
git push origin main

echo
echo "✅ Version bump pushed to trigger Vercel!"
echo
echo "This forces Vercel to rebuild the entire application."
echo "Check your site in 2-3 minutes:"
echo "- Entrance: https://smart-parking-nine-rho.vercel.app/"
echo "- Staff Panel: https://smart-parking-nine-rho.vercel.app/panel"
echo
echo "Press Enter to continue..."
read
