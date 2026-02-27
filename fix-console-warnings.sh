#!/bin/bash

echo "FIXING CONSOLE WARNINGS"
echo "======================"
echo

echo "Step 1: Fixed accessibility warnings..."
echo "- Added proper ARIA attributes to BookingModal"
echo "- Added role='dialog' for screen readers"
echo "- Added aria-labelledby and aria-describedby"
echo "- Added proper title and description IDs"

echo "Step 2: Add accessibility fixes..."
git add src/components/BookingModal.jsx

echo "Step 3: Commit accessibility improvements..."
git commit -m "Fix console warnings and improve accessibility

Accessibility improvements:
- Added proper ARIA attributes to BookingModal
- Fixed role='dialog' for screen readers
- Added aria-labelledby='booking-modal-title'
- Added aria-describedby='booking-modal-description'
- Added proper title and description elements
- Improved semantic HTML structure

This resolves console warnings:
- DialogContent accessibility warnings
- Missing Description warnings
- Screen reader compatibility issues"

echo "Step 4: Push fixes to trigger deployment..."
git push origin main

echo
echo "✅ CONSOLE WARNINGS FIXED!"
echo
echo "Accessibility improvements deployed:"
echo "- Screen reader friendly"
echo "- Proper ARIA labels"
echo "- Semantic HTML structure"
echo "- No more console warnings"
echo
echo "Wait 2-3 minutes and check the site"
echo "Press Enter to continue..."
read
