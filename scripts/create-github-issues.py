#!/usr/bin/env python3
"""
Create GitHub issues from DEVELOPMENT-PLAN.md tasks
"""

import subprocess
import time
import sys

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
        "dependencies": [],
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
```

## TDD Approach
- Create initial smoke tests to verify app launches
- Test that React component renders
- Verify Tauri window creation"""
    },
    {
        "id": "TASK-002",
        "title": "Copy Claudia UI Components",
        "labels": ["phase-0-setup", "P0-critical", "frontend"],
        "dependencies": ["TASK-001"],
        "description": """Copy necessary UI components from Claudia project maintaining directory structure.

## Success Criteria
- [ ] UI components copied to `src/components/ui/`
- [ ] Component imports updated
- [ ] Basic UI renders without errors
- [ ] shadcn/ui dependencies added

## Components to Copy
- Card, Button, Slider, Input
- Label, Tabs, Dialog, Alert
- Dropdown, Tooltip, Progress

## TDD Approach
- Write tests for each component before copying
- Verify component renders correctly
- Test component props and interactions"""
    },
    {
        "id": "TASK-003",
        "title": "Configure Tailwind CSS & shadcn/ui",
        "labels": ["phase-0-setup", "P0-critical", "frontend"],
        "dependencies": ["TASK-001"],
        "description": """Set up Tailwind CSS and shadcn/ui following Claudia patterns.

## Success Criteria
- [ ] Tailwind CSS configured
- [ ] shadcn/ui components working
- [ ] Consistent theme applied
- [ ] Dark mode support configured
- [ ] CSS variables defined

## Configuration
- Copy Tailwind config from Claudia
- Set up CSS variables
- Configure PostCSS
- Add base styles

## TDD Approach
- Test theme switching functionality
- Verify CSS classes apply correctly
- Test responsive behavior"""
    },
    {
        "id": "TASK-004",
        "title": "Setup Build Tools",
        "labels": ["phase-0-setup", "P0-critical", "build"],
        "dependencies": ["TASK-003"],
        "description": """Configure Vite, TypeScript, and build process.

## Success Criteria
- [ ] Vite configured for React
- [ ] TypeScript strict mode enabled
- [ ] Path aliases configured
- [ ] Build process working
- [ ] Hot module replacement working

## TDD Approach
- Test build output structure
- Verify TypeScript compilation
- Test path alias resolution"""
    },
    {
        "id": "TASK-005",
        "title": "Setup Testing Framework",
        "labels": ["phase-0-setup", "P0-critical", "testing"],
        "dependencies": ["TASK-004"],
        "description": """Configure Vitest and React Testing Library for TDD workflow.

## Success Criteria
- [ ] Vitest configured
- [ ] React Testing Library installed
- [ ] Rust test structure set up
- [ ] Mock Tauri APIs configured
- [ ] Test scripts in package.json
- [ ] Coverage reporting configured
- [ ] Example tests passing

## Setup Commands
```bash
bun add -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom
bun add -D @vitest/coverage-v8 jsdom
bun add -D @tauri-apps/api
```"""
    },
    {
        "id": "TASK-006",
        "title": "Setup Husky Pre-commit Hooks",
        "labels": ["phase-0-setup", "P0-critical", "build"],
        "dependencies": ["TASK-005"],
        "description": """Configure pre-commit hooks for code quality.

## Success Criteria
- [ ] Husky installed and configured
- [ ] Pre-commit hook configured
- [ ] dprint formatting on commit
- [ ] ESLint checking on commit
- [ ] TypeScript type checking on commit
- [ ] Tests run on commit (when available)
- [ ] Commit fails if any checks fail
- [ ] Rust formatting and clippy checks included

## Setup Commands
```bash
bun add -D husky lint-staged dprint
bunx husky init
echo "bunx lint-staged" > .husky/pre-commit
```"""
    },
    
    # Phase 1: FFI Integration
    {
        "id": "TASK-007",
        "title": "Clone RyzenAdj as Submodule",
        "labels": ["phase-1-ffi", "P1-high", "ffi"],
        "dependencies": ["TASK-006"],
        "description": """Add RyzenAdj as git submodule and build the library.

## Success Criteria
- [ ] RyzenAdj added as submodule in `lib/`
- [ ] Library builds successfully
- [ ] Headers accessible for FFI
- [ ] Build script created

## Commands
```bash
git submodule add https://github.com/FlyGoat/RyzenAdj.git lib/RyzenAdj
cd lib/RyzenAdj
mkdir build && cd build
cmake ..
make
```"""
    },
    {
        "id": "TASK-008",
        "title": "Create Rust FFI Bindings with Tests",
        "labels": ["phase-1-ffi", "P1-high", "backend", "ffi"],
        "dependencies": ["TASK-007"],
        "description": """Create Rust FFI bindings for RyzenAdj C library using TDD approach.

## Success Criteria
- [ ] Write failing tests for FFI wrapper functions
- [ ] FFI bindings created in `src-tauri/src/ryzenadj/mod.rs`
- [ ] All necessary functions declared
- [ ] Types properly mapped
- [ ] Linking configured in build.rs
- [ ] Tests passing for all bindings

## TDD Approach
- Write tests for each FFI function
- Mock C library responses
- Test error handling
- Verify memory safety"""
    },
    {
        "id": "TASK-009",
        "title": "Implement Safe Wrappers with Tests",
        "labels": ["phase-1-ffi", "P1-high", "backend", "ffi"],
        "dependencies": ["TASK-008"],
        "description": """Create safe Rust wrappers around unsafe FFI calls.

## Success Criteria
- [ ] Write tests for safe wrapper API
- [ ] Safe wrapper struct created
- [ ] All unsafe operations contained
- [ ] Proper error handling
- [ ] Thread safety guaranteed
- [ ] Memory management handled
- [ ] All tests passing

## TDD Approach
- Test null pointer handling
- Test concurrent access
- Verify Drop implementation
- Test error propagation"""
    },
    {
        "id": "TASK-010",
        "title": "Build Native Library Integration",
        "labels": ["phase-1-ffi", "P1-high", "backend", "build"],
        "dependencies": ["TASK-008"],
        "description": """Configure build.rs to link RyzenAdj library.

## Success Criteria
- [ ] build.rs configured
- [ ] Library paths set correctly
- [ ] Static/dynamic linking working
- [ ] Cross-platform build support
- [ ] CI build passing"""
    },
    {
        "id": "TASK-011",
        "title": "Create Tauri Commands with Tests",
        "labels": ["phase-1-ffi", "P1-high", "backend"],
        "dependencies": ["TASK-010"],
        "description": """Implement Tauri commands for frontend-backend communication using TDD.

## Success Criteria
- [ ] Write tests for each command first
- [ ] Commands created in `src-tauri/src/commands/`
- [ ] Error handling implemented and tested
- [ ] Type definitions exported
- [ ] Commands registered in main.rs
- [ ] All command tests passing

## Commands to Implement
- get_power_metrics
- set_power_limits
- get_system_info
- check_privileges

## TDD Approach
- Mock RyzenAdj responses
- Test error conditions
- Verify serialization
- Test concurrent calls"""
    },
    
    # Phase 2: Core Features
    {
        "id": "TASK-012",
        "title": "Power Monitoring Dashboard with Tests",
        "labels": ["phase-2-core", "P1-high", "frontend"],
        "dependencies": ["TASK-002", "TASK-011"],
        "description": """Create power monitoring dashboard using TDD.

## Success Criteria
- [ ] Write component tests first
- [ ] Dashboard component created
- [ ] Real-time power display working
- [ ] Chart rendering correctly
- [ ] Responsive layout
- [ ] All tests passing
- [ ] 80%+ test coverage

## TDD Approach
- Test component renders
- Test data updates
- Mock Tauri commands
- Test chart interactions
- Verify responsive behavior"""
    },
    {
        "id": "TASK-013",
        "title": "Power Control Sliders with Tests",
        "labels": ["phase-2-core", "P1-high", "frontend"],
        "dependencies": ["TASK-002", "TASK-011"],
        "description": """Implement power limit controls using TDD.

## Success Criteria
- [ ] Write slider component tests
- [ ] Slider components created
- [ ] Debounced updates working
- [ ] Visual feedback on changes
- [ ] Validation implemented
- [ ] All tests passing

## TDD Approach
- Test slider interactions
- Test debounce behavior
- Test validation logic
- Mock command calls"""
    },
    {
        "id": "TASK-014",
        "title": "Temperature Display with Tests",
        "labels": ["phase-2-core", "P2-medium", "frontend"],
        "dependencies": ["TASK-002", "TASK-011"],
        "description": """Create temperature monitoring display using TDD.

## Success Criteria
- [ ] Write display tests first
- [ ] Temperature component created
- [ ] Real-time updates working
- [ ] Color coding for ranges
- [ ] Historical chart option
- [ ] All tests passing"""
    },
    {
        "id": "TASK-015",
        "title": "State Management Setup with Tests",
        "labels": ["phase-2-core", "P1-high", "frontend"],
        "dependencies": ["TASK-004"],
        "description": """Configure Zustand state management with tests.

## Success Criteria
- [ ] Write store tests first
- [ ] Zustand store created
- [ ] Actions implemented
- [ ] Selectors optimized
- [ ] Persistence configured
- [ ] All tests passing

## TDD Approach
- Test state updates
- Test async actions
- Test persistence
- Verify subscriptions"""
    },
    {
        "id": "TASK-016",
        "title": "Profile Management with Tests",
        "labels": ["phase-2-core", "P2-medium", "frontend"],
        "dependencies": ["TASK-013", "TASK-015"],
        "description": """Implement profile save/load functionality using TDD.

## Success Criteria
- [ ] Write profile tests first
- [ ] Profile CRUD operations
- [ ] Quick presets available
- [ ] Import/export working
- [ ] Profile switching smooth
- [ ] All tests passing

## TDD Approach
- Test CRUD operations
- Test profile validation
- Test preset values
- Mock file operations"""
    },
    
    # Phase 3: Platform Features
    {
        "id": "TASK-017",
        "title": "Privilege Elevation Check",
        "labels": ["phase-3-platform", "P1-high", "backend"],
        "dependencies": ["TASK-011"],
        "description": """Implement admin/root privilege checking.

## Success Criteria
- [ ] Windows admin check working
- [ ] Linux root check working
- [ ] Clear error messages
- [ ] Elevation prompt option
- [ ] Tests for both platforms"""
    },
    {
        "id": "TASK-018",
        "title": "Platform-Specific Handlers",
        "labels": ["phase-3-platform", "P1-high", "backend"],
        "dependencies": ["TASK-017"],
        "description": """Create platform-specific implementations.

## Success Criteria
- [ ] Windows-specific code paths
- [ ] Linux-specific code paths
- [ ] macOS compatibility layer
- [ ] Platform detection working
- [ ] Tests for each platform"""
    },
    {
        "id": "TASK-019",
        "title": "Error Handling UI",
        "labels": ["phase-3-platform", "P2-medium", "frontend"],
        "dependencies": ["TASK-017"],
        "description": """Create comprehensive error handling UI.

## Success Criteria
- [ ] Error boundary implemented
- [ ] User-friendly messages
- [ ] Recovery options shown
- [ ] Error logging configured
- [ ] Tests for error states"""
    },
    {
        "id": "TASK-020",
        "title": "System Information Display",
        "labels": ["phase-3-platform", "P3-low", "frontend"],
        "dependencies": ["TASK-011"],
        "description": """Show system and CPU information.

## Success Criteria
- [ ] CPU model displayed
- [ ] Supported features shown
- [ ] Driver version info
- [ ] Platform details visible
- [ ] Tests for display logic"""
    },
    
    # Phase 4: Testing & Validation
    {
        "id": "TASK-021",
        "title": "Integration Tests - Full Stack",
        "labels": ["phase-4-testing", "P1-high", "testing"],
        "dependencies": ["TASK-016", "TASK-018"],
        "description": """Create comprehensive integration tests.

## Success Criteria
- [ ] End-to-end test suite
- [ ] Profile workflow tests
- [ ] Power adjustment tests
- [ ] Error scenario tests
- [ ] 70%+ integration coverage"""
    },
    {
        "id": "TASK-022",
        "title": "Performance Testing",
        "labels": ["phase-4-testing", "P2-medium", "testing"],
        "dependencies": ["TASK-012", "TASK-013"],
        "description": """Implement performance benchmarks and tests.

## Success Criteria
- [ ] Memory leak tests
- [ ] CPU usage benchmarks
- [ ] Render performance tests
- [ ] Command latency tests
- [ ] Performance baseline set"""
    },
    {
        "id": "TASK-023",
        "title": "Hardware Compatibility Tests",
        "labels": ["phase-4-testing", "P2-medium", "testing"],
        "dependencies": ["TASK-019"],
        "description": """Test on various AMD Ryzen CPUs.

## Success Criteria
- [ ] Test matrix created
- [ ] 5000 series tested
- [ ] 6000 series tested
- [ ] 7000 series tested
- [ ] Compatibility report"""
    },
    
    # Phase 5: Polish & Advanced
    {
        "id": "TASK-024",
        "title": "System Tray Integration",
        "labels": ["phase-5-polish", "P3-low", "frontend"],
        "dependencies": ["TASK-015", "TASK-017"],
        "description": """Add system tray functionality.

## Success Criteria
- [ ] Tray icon working
- [ ] Quick controls menu
- [ ] Profile switching
- [ ] Minimize to tray
- [ ] Tests for tray logic"""
    },
    {
        "id": "TASK-025",
        "title": "Auto-start Capability",
        "labels": ["phase-5-polish", "P3-low", "backend"],
        "dependencies": ["TASK-024"],
        "description": """Implement auto-start on system boot.

## Success Criteria
- [ ] Windows auto-start
- [ ] Linux auto-start
- [ ] User preference saved
- [ ] Clean uninstall
- [ ] Tests for both platforms"""
    },
    {
        "id": "TASK-026",
        "title": "Export Metrics Feature",
        "labels": ["phase-5-polish", "P3-low", "frontend"],
        "dependencies": ["TASK-012"],
        "description": """Add metrics export functionality.

## Success Criteria
- [ ] CSV export working
- [ ] JSON export option
- [ ] Time range selection
- [ ] File save dialog
- [ ] Export tests"""
    },
    {
        "id": "TASK-027",
        "title": "Multi-language Support",
        "labels": ["phase-5-polish", "P3-low", "frontend"],
        "dependencies": ["TASK-003"],
        "description": """Implement internationalization.

## Success Criteria
- [ ] i18n framework setup
- [ ] English strings extracted
- [ ] Language switching works
- [ ] RTL support considered
- [ ] Translation tests"""
    }
]

# Create issues
if __name__ == "__main__":
    print("Creating GitHub issues for Resonance...")
    print("=" * 50)
    
    # Check if gh is installed
    try:
        subprocess.run(["gh", "--version"], capture_output=True, check=True)
    except:
        print("❌ GitHub CLI (gh) is not installed!")
        print("Install it from: https://cli.github.com/")
        sys.exit(1)
    
    # Check if we're in a git repo
    try:
        subprocess.run(["git", "rev-parse", "--git-dir"], capture_output=True, check=True)
    except:
        print("❌ Not in a git repository!")
        sys.exit(1)
    
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
    
    print("\nIssue mapping saved to issue-mapping.txt")
    print("\nNext steps:")
    print("1. Review created issues on GitHub")
    print("2. Set up project board")
    print("3. Start with TASK-001!")