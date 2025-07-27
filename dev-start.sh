#!/bin/bash

# Resonance Development Session Starter
# This script helps agents get started with development

set -e

echo "════════════════════════════════════════════════════════════════════"
echo "                    Resonance Development Session"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "⚠️  WARNING: GitHub CLI (gh) is not installed!"
    echo "   Please install it for the best development experience:"
    echo "   https://cli.github.com/"
    echo ""
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "⚠️  ERROR: Not in a git repository!"
    echo "   Please run this from the resonance project root."
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main 2>/dev/null || echo "   (Could not pull - you may be on a feature branch)"
echo ""

# Show current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Current branch: $CURRENT_BRANCH"

# Show any uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "📝 You have uncommitted changes"
fi
echo ""

# Check GitHub auth status
echo "🔐 GitHub Authentication Status:"
if gh auth status &>/dev/null; then
    echo "   ✅ Authenticated"
    echo ""
    
    # Show assigned issues
    echo "📋 Your assigned tasks:"
    gh issue list --assignee @me --state open 2>/dev/null || echo "   No tasks assigned to you"
    echo ""
    
    # Show available tasks
    echo "🎯 Available tasks (not assigned):"
    gh issue list --label "ready" --state open --limit 5 2>/dev/null | grep -v "CLOSED" || echo "   No ready tasks available"
else
    echo "   ❌ Not authenticated. Run: gh auth login"
fi
echo ""

echo "════════════════════════════════════════════════════════════════════"
echo "                         Quick Commands"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "📖 View full guide:        cat AGENT-QUICKSTART.md"
echo "📋 List ready tasks:       gh issue list --label ready --state open"
echo "👁️  View task details:      gh issue view <number>"
echo "🔨 Start working on task:  gh issue develop <number> --checkout"
echo "🚀 Run development mode:   bun run tauri dev"
echo "✅ Run tests:              bun test"
echo "🎨 Format code:            dprint fmt"
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "💡 TIP: Read AGENT-QUICKSTART.md for the complete development workflow"
echo ""

# Make the script executable
chmod +x "$0" 2>/dev/null || true