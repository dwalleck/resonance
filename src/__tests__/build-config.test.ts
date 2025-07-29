import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

// Constants for file paths
const TSCONFIG_PATH = path.join(process.cwd(), 'tsconfig.json');
const VITE_CONFIG_PATH = path.join(process.cwd(), 'vite.config.ts');

// Type for TypeScript configuration
interface TsConfig {
  compilerOptions: {
    strict: boolean;
    paths?: Record<string, string[]>;
    baseUrl?: string;
    target: string;
    jsx: string;
    noUnusedLocals: boolean;
    noUnusedParameters: boolean;
  };
}

// Cache parsed configurations to avoid repeated file I/O
const getTsConfig = (() => {
  let cached: TsConfig | null = null;
  return (): TsConfig => {
    if (!cached) {
      cached = JSON.parse(fs.readFileSync(TSCONFIG_PATH, 'utf-8')) as TsConfig;
    }
    return cached;
  };
})();

describe('Build Configuration', () => {
  describe('TypeScript Configuration', () => {
    it('should have TypeScript strict mode enabled', () => {
      const tsconfig = getTsConfig();
      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it('should have proper path aliases configured', () => {
      const tsconfig = getTsConfig();
      expect(tsconfig.compilerOptions.paths).toBeDefined();
      expect(tsconfig.compilerOptions.paths?.['@/*']).toEqual(['./src/*']);
      expect(tsconfig.compilerOptions.baseUrl).toBe('.');
    });

    it('should target ES2020', () => {
      const tsconfig = getTsConfig();
      expect(tsconfig.compilerOptions.target).toBe('ES2020');
    });

    it('should use react-jsx for JSX transform', () => {
      const tsconfig = getTsConfig();
      expect(tsconfig.compilerOptions.jsx).toBe('react-jsx');
    });

    it('should have noUnusedLocals and noUnusedParameters enabled', () => {
      const tsconfig = getTsConfig();
      expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true);
      expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true);
    });
  });

  describe('Vite Configuration', () => {
    it('should have vite config file', () => {
      expect(fs.existsSync(VITE_CONFIG_PATH)).toBe(true);
    });

    it('should contain correct Vite configuration', () => {
      const viteConfigContent = fs.readFileSync(VITE_CONFIG_PATH, 'utf-8');

      // Check for React plugin
      expect(viteConfigContent).toContain('@vitejs/plugin-react');
      expect(viteConfigContent).toContain('react()');

      // Check for Tailwind CSS plugin
      expect(viteConfigContent).toContain('@tailwindcss/vite');
      expect(viteConfigContent).toContain('tailwindcss()');

      // Check for port configuration
      expect(viteConfigContent).toContain('port: 5173');
      expect(viteConfigContent).toContain('strictPort: true');

      // Check for path alias
      expect(viteConfigContent).toContain("'@': path.resolve(__dirname, './src')");

      // Check for build output
      expect(viteConfigContent).toContain("outDir: 'dist'");
      expect(viteConfigContent).toContain('emptyOutDir: true');
    });
  });

  describe('Path Alias Resolution', () => {
    it('should resolve @ alias imports', async () => {
      // This test verifies that TypeScript can resolve @ imports
      const canImport = async (): Promise<boolean> => {
        try {
          const module = await import('@/App');
          return module.default !== undefined;
        } catch (error) {
          console.error('Failed to import @/App:', error);
          return false;
        }
      };

      await expect(canImport()).resolves.toBe(true);
    });
  });
});
