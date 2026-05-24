#!/bin/bash
echo "🚀 Starting portfolio deployment..."

# 1. Check if Git is initialized
if [ ! -d .git ]; then
  git init
  git branch -M main
  git add .
  git commit -m "Initial commit - Modern premium portfolio"
fi

# 2. Add remote origin
git remote remove origin 2>/dev/null
git remote add origin https://github.com/amirargani/amirargani.github.io.git

echo ""
echo "------------------------------------------------------------"
echo "👉 STEP 1: Open this link and create a blank, public"
echo "   repository named 'amirargani.github.io' on your GitHub account:"
echo "   https://github.com/new"
echo "------------------------------------------------------------"
echo ""
read -p "Press ENTER once you have created the repository on GitHub..."

echo ""
echo "📤 Uploading files to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully uploaded!"
  echo "🌐 Your portfolio will be live at https://amirargani.github.io/ in about 1-2 minutes."
else
  echo ""
  echo "❌ Error uploading. Please check your GitHub credentials."
fi

