# Check for required Rust tools
Write-Host "Checking Rust toolchain..." -ForegroundColor Cyan

# Check rustfmt
try {
    rustfmt --version | Out-Null
    Write-Host "[OK] rustfmt is installed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] rustfmt not found. Installing..." -ForegroundColor Red
    rustup component add rustfmt
}

# Check clippy
try {
    cargo clippy --version | Out-Null
    Write-Host "[OK] clippy is installed" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] clippy not found. Installing..." -ForegroundColor Red
    rustup component add clippy
}

# Check if dprint is installed (skip in CI environment)
if ($env:CI -ne "true") {
    try {
        dprint --version | Out-Null
        Write-Host "[OK] dprint is installed" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] dprint not found. Please install it:" -ForegroundColor Red
        Write-Host "   Invoke-WebRequest -Uri https://dprint.dev/install.ps1 | Invoke-Expression" -ForegroundColor Yellow
        Write-Host "   or" -ForegroundColor Yellow
        Write-Host "   cargo install dprint" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "[INFO] Skipping dprint check in CI environment" -ForegroundColor Blue
}

Write-Host "All tools are ready!" -ForegroundColor Green