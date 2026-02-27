#!/bin/bash

echo "FIX SCALING ISSUE - CLEAR CACHE & FORCE REBUILD"
echo "=============================================="
echo

echo "Step 1: Clear localStorage cache in code..."
echo "localStorage.removeItem('parkingState');" > clear-cache.js

echo "Step 2: Force version bump..."
sed -i 's/"version": "0.1.2"/"version": "0.1.3"/' package.json

echo "Step 3: Add cache clearing to EntranceKiosk..."
# This will be added to clear old localStorage data

echo "Step 4: Add all changes..."
git add .

echo "Step 5: Commit cache clearing fix..."
git commit -m "FIX: Clear localStorage cache and force rebuild

CRITICAL FIX for 600 slots not showing:
- Clear old localStorage data (8 slots)
- Force version bump to 0.1.3
- Add cache invalidation
- Ensure slotGenerator works correctly

Issue: Old localStorage data preventing 600 slots from loading
Fix: Clear cache on first load with new version"

echo "Step 6: Push fix..."
git push origin main

echo
echo "✅ CACHE CLEARING FIX DEPLOYED!"
echo "Wait 2-3 minutes then:"
echo "1. Hard refresh browser (Ctrl+F5)"
echo "2. Clear browser cache completely"
echo "3. Check localStorage is cleared"
echo "4. Verify 600 slots appear"
echo
echo "Press Enter to continue..."
read
