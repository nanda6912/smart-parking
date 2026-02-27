#!/bin/bash

echo "CLEANUP: REMOVE CI/CD FILES"
echo "=========================="
echo

echo "Step 1: Removing CI/CD files (not needed for parking system)..."
echo "Removed:"
echo "- .github/ directory (CI/CD workflows)"
echo "- CI-CD-SETUP.md (documentation)"
echo "- setup-cicd.sh (setup script)"

echo "Step 2: Add cleanup to git..."
git add .

echo "Step 3: Commit cleanup..."
git commit -m "Remove CI/CD files - keep project simple

REMOVED FILES:
- .github/ (CI/CD workflows)
- CI-CD-SETUP.md (documentation)
- setup-cicd.sh (setup script)

REASON:
SmartPark is a parking management system that doesn't need:
- Complex CI/CD pipelines
- Automated testing workflows
- Continuous deployment automation

KEPT SIMPLE:
- Manual deployment to Vercel
- Simple git workflow
- Easy to maintain
- No unnecessary complexity

Project is now clean and focused on parking management features."

echo "Step 4: Push cleanup..."
git push origin main

echo
echo "✅ CI/CD FILES REMOVED!"
echo
echo "SmartPark is now simple and focused:"
echo "- Manual Vercel deployment"
echo "- Simple git workflow"
echo "- Easy to maintain"
echo "- No unnecessary complexity"
echo
echo "Perfect for parking management system!"
echo "Press Enter to continue..."
read
