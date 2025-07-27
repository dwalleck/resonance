#!/bin/bash

# Check for required Rust tools
echo "Checking Rust toolchain..."

# Check rustfmt
if ! command -v rustfmt &> /dev/null; then
    echo "❌ rustfmt not found. Installing..."
    rustup component add rustfmt
else
    echo "✅ rustfmt is installed"
fi

# Check clippy
if ! command -v cargo-clippy &> /dev/null; then
    echo "❌ clippy not found. Installing..."
    rustup component add clippy
else
    echo "✅ clippy is installed"
fi

# Check if dprint is installed (skip in CI environment)
if [ "$CI" != "true" ]; then
    if ! command -v dprint &> /dev/null; then
        echo "❌ dprint not found. Please install it:"
        echo "   curl -fsSL https://dprint.dev/install.sh | sh"
        echo "   or"
        echo "   cargo install dprint"
        exit 1
    else
        echo "✅ dprint is installed"
    fi
else
    echo "ℹ️  Skipping dprint check in CI environment"
fi

echo "All tools are ready!"