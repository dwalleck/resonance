# Resonance

[![CI](https://github.com/dwalleck/resonance/actions/workflows/ci.yml/badge.svg)](https://github.com/dwalleck/resonance/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue)](https://tauri.app)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)

Modern cross-platform GUI for RyzenAdj built with Tauri and React.

## Features

- 🚀 Real-time power and temperature monitoring
- 🎯 Precise power limit controls
- 📊 Beautiful charts with historical data
- 💾 Profile management for different scenarios
- 🔒 Safe hardware interaction with privilege handling
- 🌍 Cross-platform support (Windows, Linux, macOS)

## Development

### Prerequisites

- Node.js 20+
- Rust 1.70+
- npm or bun

### Quick Start

```bash
# Clone the repository
git clone https://github.com/dwalleck/resonance.git
cd resonance

# Install dependencies
npm install

# Run development server
npm run tauri:dev
```

### Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run Rust tests
cd src-tauri && cargo test
```

### Building

```bash
# Build for production
npm run tauri:build
```

## Contributing

Please read our [Contributing Guide](CONTRIBUTING.md) for details on our
development process.

## License

MIT License - see [LICENSE](LICENSE) for details.
