# Build Optimization Opportunities

This document outlines potential optimizations for our CI/CD build process to
reduce build times without requiring larger GitHub Actions runners.

## Current State Analysis

### Build Environment

- **Runners**: Standard GitHub-hosted runners (2 CPUs, 7 GB RAM)
  - `ubuntu-latest` for Linux builds
  - `windows-latest` for Windows builds

### Parallel Compilation

- ❌ **Not explicitly configured** for either Rust or TypeScript
- Cargo uses available CPU cores by default, but we're not setting explicit
  limits
- TypeScript compiler runs single-threaded by default

### Caching Strategy (Already Implemented ✅)

- npm package cache (via `cache: "npm"` in setup-node)
- Node modules cache
- Rust dependencies cache (cargo registry)
- Rust target directory cache

## Optimization Recommendations

### 1. Enable Explicit Parallel Rust Compilation

Add to CI workflow:

```yaml
env:
  CARGO_BUILD_JOBS: 2  # Matches the 2 CPUs available on standard runners
  # Or dynamically detect: ${{ steps.cpu-cores.outputs.count }}
```

**Impact**: Ensures consistent parallel compilation across all environments.

### 2. Optimize npm Installation

Update npm ci commands:

```yaml
- name: Install dependencies
  run: npm ci --prefer-offline --no-audit
```

**Benefits**:

- `--prefer-offline`: Uses cached packages when available
- `--no-audit`: Skips security audit during CI (run separately if needed)

**Estimated time savings**: 10-20 seconds per build

### 3. Enable Incremental Rust Builds

Add to `src-tauri/Cargo.toml`:

```toml
[profile.dev]
incremental = true

[profile.release]
incremental = true
codegen-units = 256 # Increases parallelism at slight binary size cost
```

**Impact**: Faster rebuilds when only small changes are made.

### 4. Optimize TypeScript Type Checking

Current: `tsc -p tsconfig.build.json && vite build`

Options:

1. **Run type-check in parallel**:
   ```json
   "build": "concurrently \"tsc -p tsconfig.build.json --noEmit\" \"vite build\""
   ```

2. **Use faster type checker** (requires additional setup):
   - `@swc/core` with type checking
   - `esbuild` for transpilation only

3. **Skip type-check in CI** (since we have pre-commit hooks):
   ```json
   "build:ci": "vite build"  // Vite uses esbuild internally
   ```

### 5. Additional Caching Opportunities

#### Cache dist directory for unchanged sources:

```yaml
- name: Cache build output
  uses: actions/cache@v4
  with:
    path: dist
    key: ${{ runner.os }}-dist-${{ hashFiles('src/**', 'package-lock.json', 'vite.config.ts') }}
```

#### Cache dprint directory:

```yaml
- name: Cache dprint
  uses: actions/cache@v4
  with:
    path: ~/.dprint
    key: ${{ runner.os }}-dprint-${{ hashFiles('.dprintrc.json') }}
```

#### Cache Tauri's WiX toolset (Windows only):

```yaml
- name: Cache WiX toolset
  if: matrix.platform.runner == 'windows-latest'
  uses: actions/cache@v4
  with:
    path: ~/.tauri/WixTools
    key: ${{ runner.os }}-wix-toolset
```

### 6. Optimize Cargo Commands

Add flags to cargo build:

```yaml
- name: Build Tauri app
  run: |
    cd src-tauri
    cargo build --release --target ${{ matrix.platform.rust-target }} --locked
```

- `--locked`: Ensures Cargo.lock is up to date (fails fast if not)

### 7. Split Build and Test Jobs

Currently, the build job depends on lint/format. Consider:

- Running build in parallel with lint/format
- Only block on critical checks

```yaml
jobs:
  quick-checks:  # Fast checks that can fail early
    name: Format & Type Check
    # ...
  
  build:
    name: Build
    needs: [quick-checks]  # Only depend on critical checks
    # ...
  
  lint:
    name: Lint
    # runs in parallel with build
```

## Implementation Priority

1. **High Impact, Low Effort**:
   - Add `CARGO_BUILD_JOBS=2` environment variable
   - Update npm ci with `--prefer-offline --no-audit`
   - Enable incremental Rust builds

2. **Medium Impact, Medium Effort**:
   - Add dist directory caching
   - Implement parallel TypeScript checking
   - Cache additional tools (dprint, WiX)

3. **Consider for Future**:
   - Switch to faster TypeScript alternatives
   - Restructure job dependencies
   - Use larger runners for critical paths only

## Estimated Time Savings

With all optimizations:

- npm install: -10-20 seconds
- Rust compilation: -20-30% on rebuilds
- TypeScript checking: -5-10 seconds (if parallelized)
- **Total estimated savings**: 30-60 seconds per build

## Monitoring

After implementing optimizations:

1. Track build time metrics in GitHub Actions
2. Monitor cache hit rates
3. Compare before/after implementation
4. Adjust `CARGO_BUILD_JOBS` based on actual CPU usage

## Notes

- Current caching strategy is already quite good
- Main bottlenecks are compilation steps
- Parallel compilation benefits are limited by 2-CPU runners
- Consider cost/benefit of larger runners for release builds only
