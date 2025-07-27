# GitHub Repository Setup for Resonance

This document outlines the steps to set up the GitHub repository with proper
labels, issues, and development workflow.

## 1. Create Repository

```bash
# Create the repository (if using GitHub CLI)
gh repo create resonance --public \
  --description "Modern cross-platform GUI for RyzenAdj built with Tauri and React" \
  --homepage "https://github.com/dwalleck/resonance"

# Clone and set up
git remote add origin https://github.com/dwalleck/resonance.git
git branch -M main
git push -u origin main
```

## 2. Create Labels

Run these commands to create the label structure:

```bash
# Priority Labels
gh label create "P0-critical" --description "Blocking issues, fix immediately" --color "FF0000"
gh label create "P1-high" --description "Core functionality" --color "FF6B6B"
gh label create "P2-medium" --description "Important but not blocking" --color "FFA06B"
gh label create "P3-low" --description "Nice to have" --color "FFD93D"

# Status Labels
gh label create "ready" --description "Task is ready to work on" --color "0E8A16"
gh label create "in-progress" --description "Someone is actively working on it" --color "FFA500"
gh label create "blocked" --description "Waiting on dependencies" --color "D73A4A"
gh label create "review" --description "PR submitted, needs review" --color "5319E7"

# Component Labels
gh label create "frontend" --description "React/TypeScript work" --color "61DAFB"
gh label create "backend" --description "Rust/Tauri work" --color "DEA584"
gh label create "ffi" --description "RyzenAdj bindings" --color "F74C00"
gh label create "testing" --description "Test-related tasks" --color "00FF00"
gh label create "docs" --description "Documentation updates" --color "0075CA"
gh label create "build" --description "Build tools and configuration" --color "795548"

# Phase Labels
gh label create "phase-0-setup" --description "Project initialization" --color "E99695"
gh label create "phase-1-ffi" --description "FFI integration" --color "F9D0C4"
gh label create "phase-2-core" --description "Core features" --color "FEF2C0"
gh label create "phase-3-platform" --description "Platform-specific features" --color "C5DEF5"
gh label create "phase-4-testing" --description "Testing & validation" --color "BFD4F2"
gh label create "phase-5-polish" --description "Advanced features" --color "D4C5F9"

# Additional Labels
gh label create "good-first-issue" --description "Good for newcomers" --color "7057FF"
gh label create "help-wanted" --description "Extra attention needed" --color "008672"
gh label create "bug" --description "Something isn't working" --color "D73A4A"
gh label create "enhancement" --description "New feature or request" --color "A2EEEF"
gh label create "dependencies" --description "Task has dependencies" --color "B60205"
```

## 3. Create Issues from Development Plan

Use this script to convert DEVELOPMENT-PLAN.md tasks to GitHub issues:

````python
#!/usr/bin/env python3
# save as: create-github-issues.py

import re
import subprocess
import time

def create_issue(task_id, title, description, labels, dependencies=None):
    """Create a GitHub issue using gh CLI"""
    
    # Build the body with dependencies if they exist
    body = description
    if dependencies:
        body += f"\n\n## Dependencies\n- Depends on: {', '.join(dependencies)}"
    
    # Build label string
    label_str = ",".join(labels)
    
    # Create the issue
    cmd = [
        "gh", "issue", "create",
        "--title", f"[{task_id}] {title}",
        "--body", body,
        "--label", label_str
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Created issue for {task_id}")
            # Extract issue number from output
            issue_url = result.stdout.strip()
            issue_num = issue_url.split("/")[-1]
            return int(issue_num)
        else:
            print(f"❌ Failed to create issue for {task_id}: {result.stderr}")
            return None
    except Exception as e:
        print(f"❌ Error creating issue for {task_id}: {e}")
        return None

# Task definitions based on DEVELOPMENT-PLAN.md
tasks = [
    # Phase 0: Project Setup
    {
        "id": "TASK-001",
        "title": "Initialize Tauri Project",
        "labels": ["phase-0-setup", "P0-critical", "ready", "build"],
        "description": """Initialize the base Tauri project with React TypeScript template.

## Success Criteria
- [ ] Tauri project initialized with React TypeScript
- [ ] Basic project structure created
- [ ] Development server runs successfully
- [ ] Basic window opens with React app

## Commands
```bash
npm create tauri-app@latest resonance -- --template react-ts
cd resonance
bun install  # or npm install
````

""" }, # Add more tasks here following the same pattern... ]

# Create issues

if **name** == "**main**": print("Creating GitHub issues for Resonance...")
print("=" * 50)

    issue_map = {}

    for task in tasks:
        issue_num = create_issue(
            task["id"],
            task["title"],
            task["description"],
            task["labels"],
            task.get("dependencies", [])
        )
        
        if issue_num:
            issue_map[task["id"]] = issue_num
        
        # Rate limit pause
        time.sleep(1)

    print("\n" + "=" * 50)
    print(f"Created {len(issue_map)} issues successfully!")

    # Save mapping for reference
    with open("issue-mapping.txt", "w") as f:
        for task_id, issue_num in issue_map.items():
            f.write(f"{task_id}: #{issue_num}\n")

````
## 4. Set Up Project Board

```bash
# Create a project board
gh project create --title "resonance Development" \
  --description "Development tracking for resonance"

# Link repository to project
# (This needs to be done via web UI or API)
````

## 5. Configure Repository Settings

### Branch Protection

```bash
# Set up branch protection for main
gh api repos/dwalleck/resonance/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["continuous-integration"]}' \
  --field enforce_admins=false \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```

### Repository Topics

```bash
gh repo edit dwalleck/resonance --add-topic tauri,react,rust,amd,ryzen,power-management
```

## 6. Initial Commit Structure

Before creating issues, ensure these files are committed:

```bash
# Add all configuration files
git add CLAUDE.md
git add DEVELOPMENT-PLAN.md
git add AGENT-QUICKSTART.md
git add GITHUB-SETUP.md
git add dev-start.sh
git add RYZENADJ_TAURI_PROJECT_PLAN.md

# Create initial commit
git commit -m "Initial project setup with development guides

- Add CLAUDE.md with project conventions
- Add DEVELOPMENT-PLAN.md with 27 TDD-focused tasks
- Add AGENT-QUICKSTART.md for developer onboarding
- Add GitHub setup guide
- Add dev-start.sh for quick development startup
- Include original project plan"

# Push to GitHub
git push -u origin main
```

## 7. GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        
    - name: Setup Rust
      uses: dtolnay/rust-toolchain@stable
      
    - name: Install dependencies
      run: |
        npm install
        sudo apt-get update
        sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev
        
    - name: Lint
      run: npm run lint
      
    - name: Type check
      run: npm run type-check
      
    - name: Test frontend
      run: npm test
      
    - name: Test backend
      run: cd src-tauri && cargo test
      
    - name: Check formatting
      run: |
        npx dprint check
        cd src-tauri && cargo fmt -- --check
```

## 8. Development Workflow Summary

1. **Developers run `./dev-start.sh`** to begin their session
2. **Check GitHub issues** for available tasks (labeled "ready")
3. **Assign themselves** to an issue
4. **Create feature branch** using issue number
5. **Follow TDD approach** as outlined in DEVELOPMENT-PLAN.md
6. **Create PR** when complete, linking to issue
7. **CI runs** automatically on PR
8. **Review and merge** when all checks pass

## Next Steps

1. Create the GitHub repository
2. Run the label creation commands
3. Commit initial files
4. Create issues for all 27 tasks from DEVELOPMENT-PLAN.md
5. Set up CI/CD with GitHub Actions
6. Start development with TASK-001!

The repository is now ready for agent-based development with GitHub issues as
the source of truth.
