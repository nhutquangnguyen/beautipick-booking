#!/bin/bash

# Beautipick Booking - Deploy Script
# This script commits changes, pushes to GitHub, and deploys to Vercel

set -e  # Exit on error

echo "🚀 Starting deployment process..."
echo ""

# Check if there are changes to commit
if [[ -z $(git status -s) ]]; then
  echo "✅ No changes to commit"
else
  echo "📝 Changes detected, preparing to commit..."

  # Show current status
  git status --short
  echo ""

  # Ask for commit message
  read -p "Enter commit message (or press Enter for default): " commit_message

  # Use default message if none provided
  if [[ -z "$commit_message" ]]; then
    commit_message="Update: $(date '+%Y-%m-%d %H:%M:%S')"
  fi

  echo ""
  echo "📦 Adding files to git..."
  git add .

  echo "💾 Committing changes..."
  git commit -m "$commit_message

🤖 Generated with Claude Code (https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

  echo "✅ Changes committed"
fi

echo ""
echo "⬆️  Pushing to GitHub..."
git push origin main

echo "✅ Pushed to GitHub"
echo ""

echo "🚢 Deploying to Vercel production..."
vercel deploy --prod --yes

echo ""
echo "✨ Deployment complete!"
echo ""
echo "🌐 Your app is live at:"
echo "   - https://beautipick.com"
echo "   - https://www.beautipick.com"
echo ""
