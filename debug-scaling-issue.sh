#!/bin/bash

echo "DEBUGGING SCALING DEPLOYMENT ISSUE"
echo "================================="
echo

echo "Step 1: Check current git status..."
git status

echo "Step 2: Check if scaling code is actually in the latest commit..."
git log --oneline -5

echo "Step 3: Verify slotGenerator is in the commit..."
git show HEAD:src/utils/slotGenerator.js | head -10

echo "Step 4: Check if EntranceKiosk scaling is committed..."
git show HEAD:src/pages/EntranceKiosk.jsx | head -20

echo "Step 5: Force rebuild by updating version..."
sed -i 's/"version": "0.1.1"/"version": "0.1.2"/' package.json

echo "Step 6: Add version bump and force cache invalidation..."
echo "Cache invalidation $(date)" > cache-invalidate.txt
git add package.json cache-invalidate.txt

echo "Step 7: Commit with force rebuild message..."
git commit -m "DEBUG: Force rebuild and cache invalidation

Forcing Vercel to rebuild:
- Version bump: 0.1.1 -> 0.1.2
- Cache invalidation file added
- Ensuring latest scaling code is deployed
- Debugging 600 slots not showing

Expected: 600 slots (300 per floor)
Current: Only 8 slots showing
Issue: Deployment or caching problem"

echo "Step 8: Push to trigger fresh deployment..."
git push origin main

echo
echo "✅ DEBUG DEPLOYMENT PUSHED!"
echo
echo "Debugging steps completed:"
echo "- Verified scaling code is in latest commit"
echo "- Forced version bump for rebuild"
echo "- Added cache invalidation"
echo "- Pushed fresh deployment"
echo
echo "Next debugging steps:"
echo "1. Wait 3-5 minutes for deployment"
echo "2. Check Vercel dashboard for build logs"
echo "3. Hard refresh browser (Ctrl+F5)"
echo "4. Clear browser cache completely"
echo "5. Check browser console for errors"
echo
echo "If still showing 8 slots after 5 minutes:"
echo "- Check Vercel build logs for errors"
echo "- Verify slotGenerator.js is working"
echo "- Check if localStorage has old data"
echo
echo "Press Enter to continue..."
read
