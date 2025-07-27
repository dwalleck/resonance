# CLAUDE.md

## ⚠️ CRITICAL: Before Making ANY Code Changes

**MANDATORY**: Always consult project guidelines before:

- Writing any code
- Making any modifications
- Implementing any features
- Creating any tests

Key guidelines to follow:

- Required Test-Driven Development workflow
- Documentation standards
- Code quality requirements
- Step-by-step implementation process
- Verification checklists

**SPECIAL ATTENTION**: If working as part of a multi-agent team:

1. You MUST follow parallel development workflows
2. You MUST create branches and show ALL command outputs
3. You MUST run verification scripts and show their output
4. You MUST create progress tracking files

**NEVER** proceed with implementation without following established guidelines.

## ⚠️ CRITICAL: MCP Tool Usage

**MANDATORY**: When working with external packages or encountering compilation
errors:

1. **ALWAYS use context7 MCP** for npm/Rust crate documentation
2. **NEVER guess** at API signatures or method names
3. **IMMEDIATELY check** context7 when you see "method not found" or "cannot
   find module" errors
4. **READ MCP-USAGE-GUIDE.md** for detailed instructions

Example workflow:

```
Compilation error → Is it package-related? → Use context7 MCP
Need to use Tauri APIs? → Check context7 FIRST
Unsure about Recharts syntax? → Use context7 for current docs
```

## Overview

Resonance is a modern, cross-platform graphical user interface for RyzenAdj,
built with Tauri (Rust) and React (TypeScript). It provides real-time power and
temperature monitoring for AMD Ryzen mobile processors, enabling users to adjust
power limits, create performance profiles, and optimize their system's
performance and battery life. The application leverages components from the
Claudia project and uses shadcn/ui for a polished user interface.

**Primary Implementation**: Tauri with React frontend and Rust backend, using
FFI bindings to interact with the RyzenAdj C library for hardware control.

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Framework Philosophy

You are operating in collaborative mode with human-in-the-loop chain-of-thought
reasoning. Your role is to be a rational problem-solving partner, not just a
solution generator.

### Always Do

- Think logically and systematically
- Break problems into clear reasoning steps
- Analyze problems methodically and concisely
- Choose minimal effective solutions over complex approaches
- Express uncertainties
- Use natural language flow in all communications
- Reassess problem-solution alignment when human provides input
- Ask for human input at key decision points
- Validate understanding when proceeding
- Preserve context across iterations
- Explain trade-offs between different approaches
- Request feedback at each significant step

### Never Do

- Use logical fallacies and invalid reasoning
- Provide complex solutions without human review
- Assume requirements when they're unclear
- Skip reasoning steps for non-trivial problems
- Ignore or dismiss human feedback
- Continue when you're uncertain about direction
- Make significant decisions without explicit approval
- Rush to solutions without proper analysis

## Workspace-specific rules

### General Guidelines for Programming Languages

1. Clarity and Readability
   - Favor straightforward, self-explanatory code structures across all
     languages
   - Include descriptive comments to clarify complex logic

2. Language-Specific Best Practices
   - TypeScript: Use strict mode, proper typing, and avoid `any`
   - Rust: Follow ownership principles, use Result types for error handling
   - React: Use functional components with hooks, proper state management

3. Consistency Across Codebases
   - Maintain uniform coding conventions and naming schemes
   - Follow established patterns from the Claudia project for UI components

### Task Execution & Workflow

#### Task Definition & Steps

1. Specification
   - Define clear objectives for power management features
   - Consider platform-specific requirements (Windows admin, Linux root)

2. Architecture
   - Frontend: React components with TypeScript
   - Backend: Rust with Tauri commands
   - FFI: Safe wrappers around RyzenAdj C library

3. Implementation
   - Copy UI components from Claudia project
   - Implement Rust FFI bindings with safety wrappers
   - Create Tauri commands for frontend-backend communication

4. Testing
   - Test on various AMD Ryzen mobile CPUs
   - Verify privilege elevation handling
   - Ensure power limit safety guidelines are followed

5. Deployment
   - Build for Windows and Linux platforms
   - Handle platform-specific requirements

### Code Quality & Style

1. TypeScript/React
   - Use TypeScript strict mode
   - Implement proper error boundaries
   - Follow React best practices with hooks
   - Use Tailwind CSS with shadcn/ui components

2. Rust
   - Implement safe FFI wrappers
   - Use Result types for error handling
   - Follow Rust naming conventions
   - Document unsafe blocks thoroughly

3. Project Structure
   - Frontend code in `src/` (React/TypeScript)
   - Backend code in `src-tauri/` (Rust)
   - UI components in `src/components/ui/`
   - Tauri commands in `src-tauri/src/commands/`
   - RyzenAdj FFI bindings in `src-tauri/src/ryzenadj/`

### MCP (Model Context Protocol) Tools Usage

**CRITICAL**: Always use MCP tools when available for enhanced capabilities.

#### Available MCP Tools

1. **context7** - Library Documentation & Code Examples
   - **ALWAYS USE FOR**: npm packages, Rust crates, Tauri APIs
   - **When to use**:
     - TypeScript/JavaScript package documentation
     - Rust crate documentation
     - Tauri API references
     - React component library docs (Recharts, shadcn/ui)
   - **Usage pattern**:
     ```
     1. First call: mcp__context7__resolve-library-id with package name
     2. Then call: mcp__context7__get-library-docs with the returned library ID
     ```

2. **github** - GitHub Repository Operations
   - Clone RyzenAdj as submodule
   - Manage issues and PRs

3. **fetch** - Enhanced Web Content Retrieval
   - Fetch documentation and resources

4. **desktop-commander** - Advanced File/Process Operations
   - Complex file operations
   - Process management for testing

## Project-specific rules

### Technology Stack

- **Frontend**: React 18 + TypeScript with Vite
- **UI**: Tailwind CSS + shadcn/ui components (from Claudia project)
- **Backend**: Rust with Tauri
- **State Management**: Zustand
- **Charts**: Recharts for power/temperature monitoring
- **Build Tools**: Bun/npm for frontend, Cargo for Rust

### Key Commands

#### Development

```bash
# Install dependencies
bun install # or npm install

# Run in development mode
bun run tauri dev # or npm run tauri dev

# Build for production
bun run tauri build # or npm run tauri build

# Build native library
cd src-tauri
cargo build --release

# Run frontend only (for UI development)
bun run dev # or npm run dev

# Check TypeScript types
bun run type-check # or npm run type-check

# Lint code
bun run lint # or npm run lint

# Format code with dprint
dprint fmt

# Check formatting
dprint check
```

### Key Conventions

1. **UI Components**
   - Copy from Claudia project maintaining structure
   - Use shadcn/ui components consistently
   - Follow Tailwind CSS conventions

2. **FFI Safety**
   - All RyzenAdj calls must be wrapped in safe Rust functions
   - Handle null pointers explicitly
   - Use Mutex for thread safety

3. **Real-time Monitoring**
   - Use 1-second polling intervals
   - Store metrics in Zustand store
   - Limit history to prevent memory issues

4. **Power Limits**
   - Values in milliwatts (25000 = 25W)
   - Enforce safe ranges (5W-54W typical)
   - Show clear units in UI

5. **Platform Handling**
   - Check for admin/root before operations
   - Provide clear error messages
   - Graceful degradation if privileges missing

### Testing Considerations

- Test on AMD Ryzen 5000/6000/7000 series mobile CPUs
- Verify temperature readings are accurate
- Test profile switching under load
- Ensure no memory leaks in monitoring
- Validate power limit safety boundaries

### Performance Guidelines

- Minimize re-renders in React components
- Use React.memo for chart components
- Debounce slider inputs
- Efficient metric history management
- Lazy load heavy components

### Error Handling

- User-friendly error messages
- Fallback UI states
- Graceful handling of missing privileges
- Clear hardware compatibility messages

## Implementation Workflow

### Phase 1: Project Setup

1. Initialize Tauri project with React TypeScript template
2. Copy UI components from Claudia
3. Set up Tailwind CSS and shadcn/ui
4. Configure build tools

### Phase 2: FFI Integration

1. Create RyzenAdj bindings in Rust
2. Implement safe wrappers
3. Build native library integration
4. Create Tauri commands

### Phase 3: Core Features

1. Power monitoring dashboard
2. Power control sliders
3. Temperature display
4. Profile management

### Phase 4: Polish

1. System tray integration
2. Auto-start capability
3. Export metrics
4. Multi-language support

## Key Files to Reference

- `RYZENADJ_TAURI_PROJECT_PLAN.md` - Detailed implementation plan
- `src/components/ui/` - UI components from Claudia
- `src-tauri/src/ryzenadj/` - FFI bindings
- `src/stores/powerStore.ts` - State management
- `src-tauri/tauri.conf.json` - Tauri configuration
