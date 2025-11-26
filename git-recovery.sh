#!/bin/bash
# Git Recovery Script - Run this to fix the git index lock issue

set -e

echo "🔧 Starting Git Recovery..."

# Step 1: Kill any stuck git processes
echo "1️⃣ Killing stuck git processes..."
pkill -f 'git' 2>/dev/null || true
sleep 2

# Step 2: Remove the lock file
echo "2️⃣ Removing git index lock file..."
rm -f /home/runner/workspace/.git/index.lock

# Step 3: Reset to remote state
echo "3️⃣ Fetching latest from remote..."
git fetch origin

# Step 4: Check current status
echo "4️⃣ Current status:"
git status

# Step 5: Add and commit vercel.json
echo "5️⃣ Adding vercel.json..."
git add vercel.json

echo "6️⃣ Committing changes..."
git commit -m "Resolve merge conflict: combine redirects and functions config"

# Step 6: Pull latest changes
echo "7️⃣ Pulling latest from origin..."
git pull origin main

# Step 7: Push to remote
echo "8️⃣ Pushing to origin..."
git push origin main

echo "✅ Git recovery complete!"
