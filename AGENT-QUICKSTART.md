# Resonance Agent Quick Start Guide

## 🚀 Welcome to Resonance Development

You are working on **Resonance**, a modern cross-platform GUI for RyzenAdj built
with Tauri (Rust) and React (TypeScript). This document provides everything you
need to get started and contribute effectively.

## ⚠️ CRITICAL: First Steps

### 1. GitHub Issues are Source of Truth

All tasks, requirements, and specifications are tracked in GitHub issues. Do NOT
rely on local markdown files for task details.

### 2. MCP Tools Required

**MANDATORY**: Always use context7 MCP tool for:

- npm package documentation (React, Recharts, Zustand)
- Rust crate documentation (Tauri APIs)
- When encountering "method not found" or compilation errors
- Before implementing any external package features

### 3. Read Project Guidelines

**ALWAYS** check CLAUDE.md for project-specific conventions before:

- Writing any code
- Making architecture decisions
- Implementing new features

## 📋 Essential Commands

```bash
# Start your development session
./dev-start.sh

# Check GitHub for available tasks
gh issue list --label "ready" --state open

# View specific task details
gh issue view <issue-number>

# Create feature branch for a task
git checkout -b task-<issue-number>-<brief-description>

# Run development server
bun run tauri dev  # or npm run tauri dev

# Run tests
bun test           # Frontend tests
cd src-tauri && cargo test  # Backend tests

# Format code before committing
dprint fmt

# Check formatting
dprint check

# Run pre-commit hooks manually
bunx lint-staged
```

## 🗂️ Project Structure

```
resonance/
├── src/                    # React frontend
│   ├── components/ui/      # shadcn/ui components (from Claudia)
│   ├── stores/            # Zustand state management
│   └── lib/               # Utilities and types
├── src-tauri/             # Rust backend
│   ├── src/commands/      # Tauri commands
│   ├── src/ryzenadj/      # FFI bindings
│   └── Cargo.toml
├── CLAUDE.md              # Project guidelines (MUST READ)
├── DEVELOPMENT-PLAN.md    # Full task breakdown
└── package.json
```

## 🏃 Daily Workflow

### Starting Your Session (5 minutes)

```bash
# 1. Pull latest changes
git pull origin main

# 2. Check available tasks
gh issue list --label "ready" --assignee @me
gh issue list --label "ready" --state open --no-assignee

# 3. Review project status
gh issue list --state open --label "in-progress"

# 4. Pick a task and assign yourself
gh issue edit <issue-number> --add-assignee @me
```

### Before Coding (2 minutes)

- [ ] Read the full issue description and acceptance criteria
- [ ] Check issue comments for any updates or clarifications
- [ ] Review dependencies - are blocking issues complete?
- [ ] Create feature branch: `git checkout -b task-<issue-number>-description`
- [ ] Update issue status:
      `gh issue edit <issue-number> --add-label "in-progress"`

### While Coding

- [ ] Follow TDD: Write tests first, then implementation
- [ ] Commit frequently with descriptive messages
- [ ] Run tests after each significant change
- [ ] Check coverage: aim for 80%+ on new code
- [ ] Use context7 MCP for any package documentation needs

### Before Break/End of Session

```bash
# 1. Commit current work
git add .
git commit -m "WIP: <what you're working on>"

# 2. Push to your branch
git push origin task-<issue-number>-description

# 3. Update issue with progress
gh issue comment <issue-number> --body "Progress update:
- Completed: [what's done]
- Next: [what's next]
- Blockers: [any issues]"

# 4. If task is complete, create PR
gh pr create --title "[Task #<issue-number>] <Description>" \
             --body "Closes #<issue-number>

## Changes
- [List key changes]

## Testing
- [ ] All tests pass
- [ ] Coverage maintained at 80%+
- [ ] Manual testing completed

## Checklist
[Copy acceptance criteria from issue]"
```

## 🏷️ GitHub Label System

### Priority Labels

- `P0-critical`: Blocking issues, fix immediately
- `P1-high`: Core functionality, do after P0
- `P2-medium`: Important but not blocking
- `P3-low`: Nice to have

### Status Labels

- `ready`: Task is ready to work on
- `in-progress`: Someone is actively working on it
- `blocked`: Waiting on dependencies
- `review`: PR submitted, needs review

### Component Labels

- `frontend`: React/TypeScript work
- `backend`: Rust/Tauri work
- `ffi`: RyzenAdj bindings
- `testing`: Test-related tasks
- `docs`: Documentation updates

### Phase Labels

- `phase-0-setup`: Project initialization
- `phase-1-ffi`: FFI integration
- `phase-2-core`: Core features
- `phase-3-platform`: Platform-specific
- `phase-4-testing`: Testing & validation
- `phase-5-polish`: Advanced features

## 🎯 Task Selection Strategy

1. **Check Dependencies First**

   ```bash
   # View task dependencies
   gh issue view <issue-number> | grep -i "depends on"
   ```

2. **Priority Order**
   - Complete all P0 tasks first
   - Then P1 tasks in phase order
   - P2/P3 only if no P0/P1 available

3. **Pick Tasks You Can Complete**
   - Ensure you have necessary skills
   - Dependencies are resolved
   - You can test the implementation

## ✅ Definition of Done

A task is ONLY complete when:

- [ ] All acceptance criteria from issue are met
- [ ] Code follows project conventions (see CLAUDE.md)
- [ ] Tests written and passing (TDD approach)
- [ ] Coverage ≥ 80% for new code
- [ ] Code formatted with dprint
- [ ] No linting errors
- [ ] PR created and linked to issue
- [ ] CI/CD passes on the PR
- [ ] Issue is closed via PR merge

## 🔧 Technology Quick Reference

### Frontend Stack

```typescript
// React 18 + TypeScript
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';

// Zustand for state management
import { usePowerStore } from '@/stores/powerStore';

// shadcn/ui components
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

// Charts with Recharts
import { Line, LineChart, XAxis, YAxis } from 'recharts';
```

### Backend Stack

```rust
// Tauri commands
#[tauri::command]
async fn get_power_metrics() -> Result<PowerMetrics, String> {
    // Implementation
}

// FFI safety wrappers
pub struct RyzenAdj {
    handle: *mut c_void,
}

unsafe impl Send for RyzenAdj {}
unsafe impl Sync for RyzenAdj {}
```

### Testing Stack

```typescript
// Frontend: Vitest + React Testing Library
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock Tauri APIs
vi.mock('@tauri-apps/api/tauri');
```

```rust
// Backend: Rust native testing
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_ryzenadj_init() {
        // Test implementation
    }
}
```

## 🚨 Common Issues & Solutions

### "Method not found" or Package Errors

```bash
# IMMEDIATELY use context7 MCP:
# 1. Resolve library ID
mcp__context7__resolve-library-id --libraryName "package-name"
# 2. Get documentation
mcp__context7__get-library-docs --context7CompatibleLibraryID "<returned-id>"
```

### Privilege Errors

- Windows: Run as Administrator
- Linux: Use sudo or configure permissions
- Always provide clear error messages to users

### Build Issues

```bash
# Frontend
rm -rf node_modules
bun install  # or npm install
bun run tauri dev

# Backend
cd src-tauri
cargo clean
cargo build
```

## 📊 Progress Tracking

### View Project Status

```bash
# Overall progress
gh issue list --state open --label "phase-*" | grep -c "phase"
gh issue list --state closed --label "phase-*" | grep -c "phase"

# Your current tasks
gh issue list --assignee @me --state open

# Blocked tasks
gh issue list --label "blocked" --state open
```

### Update Task Status

```bash
# Mark as blocked
gh issue edit <number> --add-label "blocked" --remove-label "in-progress"

# Request review
gh issue edit <number> --add-label "review" --remove-label "in-progress"
```

## 🎯 Key Success Factors

1. **GitHub First**: Always check issues for latest requirements
2. **TDD Always**: Write tests before implementation
3. **Small PRs**: One issue = one PR, keep changes focused
4. **Clear Communication**: Update issues with progress/blockers
5. **Use MCP Tools**: Don't guess API signatures
6. **Follow Conventions**: Check CLAUDE.md for patterns

## 🔗 Quick Links

- **Project Board**: `gh browse --projects`
- **Open Issues**: `gh issue list --state open`
- **Your PRs**: `gh pr list --author @me`
- **CI Status**: `gh run list`

## 💡 Pro Tips

1. **Batch Review**: `gh pr list --state open` to see all PRs needing review
2. **Quick Assign**: `gh issue develop <number> --checkout` to assign and create
   branch
3. **Status Check**: `gh issue status` for your current work
4. **Context Switching**: Keep WIP commits small for easy task switching

## 📚 Additional Resources

- `CLAUDE.md`: Project-specific conventions and guidelines
- `DEVELOPMENT-PLAN.md`: Full project roadmap and task dependencies
- `MCP-USAGE-GUIDE.md`: How to use MCP tools effectively
- GitHub Issues: Source of truth for all tasks and requirements

---

**Remember**: When in doubt, check the GitHub issue first. All task details,
requirements, and discussions are maintained there. This guide helps you
navigate the development process, but GitHub issues contain the authoritative
task specifications.

Ready to contribute? Run `gh issue list --label "ready" --state open` and pick
your first task! 🚀
