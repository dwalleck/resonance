#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires, no-undef */

const { execSync } = require('child_process');
const { platform } = require('os');
const { join } = require('path');

const isWindows = platform() === 'win32';
const scriptDir = __dirname;

try {
  if (isWindows) {
    // Run PowerShell script on Windows
    execSync(
      `powershell -ExecutionPolicy Bypass -File "${join(scriptDir, 'check-rust-tools.ps1')}"`,
      {
        stdio: 'inherit',
      },
    );
  } else {
    // Run shell script on Unix-like systems
    execSync(`bash "${join(scriptDir, 'check-rust-tools.sh')}"`, {
      stdio: 'inherit',
    });
  }
} catch (error) {
  process.exit(1);
}
