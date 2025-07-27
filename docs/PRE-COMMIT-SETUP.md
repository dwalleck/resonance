# Pre-commit Hook Setup

This project uses Husky and lint-staged to ensure code quality before commits.

## What Gets Checked

### TypeScript/JavaScript Files (*.ts, *.tsx, *.js, *.jsx)

- **ESLint**: Checks for code quality issues and enforces coding standards
- **dprint**: Formats code consistently

### Rust Files (*.rs)

- **rustfmt**: Formats Rust code according to project style
- **clippy**: Lints Rust code for common mistakes and improvements

### Other Files

- **dprint**: Formats JSON, TOML, Markdown, YAML, CSS, and HTML files

## Setup

1. Install dependencies:
   ```bash
   npm install  # or bun install
   ```

2. Ensure Rust tools are installed:
   ```bash
   ./scripts/check-rust-tools.sh
   ```

3. Install dprint if not already installed:
   ```bash
   curl -fsSL https://dprint.dev/install.sh | sh
   # or
   cargo install dprint
   ```

## Commit Message Format

Commits must follow the conventional commit format:

```
<type>(<scope>): <subject>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or modifications
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes
- `revert`: Revert a previous commit

### Examples

- `feat(frontend): add power monitoring dashboard`
- `fix(ffi): handle null pointer in ryzenadj binding`
- `chore: update dependencies`
- `docs(readme): add installation instructions`

## Bypassing Hooks (Emergency Only)

If you need to bypass hooks in an emergency:

```bash
git commit --no-verify -m "fix: emergency fix"
```

⚠️ **Use sparingly!** This skips all quality checks.

## Troubleshooting

### ESLint Errors

- Run `npm run lint` to see all linting errors
- Many can be auto-fixed with `npx eslint . --fix`

### Rust Formatting

- Run `cargo fmt` in the `src-tauri` directory
- Run `cargo clippy` to see linting suggestions

### dprint Issues

- Run `dprint fmt` to format all files
- Check `dprint.json` for configuration

### Hook Not Running

- Ensure hooks are installed: `npx husky install`
- Check file permissions: `ls -la .husky/`
