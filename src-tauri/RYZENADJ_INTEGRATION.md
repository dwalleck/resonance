# RyzenAdj Integration

This directory contains the RyzenAdj library as a git submodule, which provides
the core functionality for adjusting AMD Ryzen processor power settings.

## Working with the Submodule

When cloning the repository for the first time:

```bash
git clone https://github.com/dwalleck/resonance.git
cd resonance
git submodule init
git submodule update
```

Or clone with submodules in one command:

```bash
git clone --recurse-submodules https://github.com/dwalleck/resonance.git
```

## Updating RyzenAdj

To update to the latest version of RyzenAdj:

```bash
cd src-tauri/RyzenAdj
git pull origin master
cd ../..
git add src-tauri/RyzenAdj
git commit -m "chore: update RyzenAdj to latest version"
```

## Building RyzenAdj

RyzenAdj will be built as part of the Rust FFI integration in subsequent tasks.
The build process will be handled by the Rust build system.

## RyzenAdj Documentation

For more information about RyzenAdj, see:

- [RyzenAdj GitHub Repository](https://github.com/FlyGoat/RyzenAdj)
- [RyzenAdj Wiki](https://github.com/FlyGoat/RyzenAdj/wiki)
