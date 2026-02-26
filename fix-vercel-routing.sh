#!/bin/bash

echo "FIXING VERCEL.JSON ROUTING ISSUE"
echo "================================="
echo

echo "Step 1: Fix vercel.json to catch all routes..."
echo '{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}' > vercel.json

echo "Step 2: Add the fixed vercel.json..."
git add vercel.json

echo "Step 3: Commit the routing fix..."
git commit -m "Fix vercel.json routing for SPA

Update vercel.json to catch all routes and redirect to index.html
This will fix the /panel route not responding issue
All routes will now be handled by the React app properly"

echo "Step 4: Push to trigger Vercel rebuild..."
git push origin main

echo
echo "✅ VERCEL.JSON ROUTING FIX PUSHED!"
echo
echo "This should fix the /panel route not responding."
echo "Wait 2-3 minutes and check:"
echo "- Staff Panel: https://smart-parking-nine-rho.vercel.app/panel"
echo "- Entrance: https://smart-parking-nine-rho.vercel.app/"
echo
echo "The fix ensures all routes are handled by React Router."
echo "Press Enter to continue..."
read
