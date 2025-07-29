import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('Build Configuration', () => {
  describe('TypeScript Configuration', () => {
    it('should have TypeScript strict mode enabled', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

      expect(tsconfig.compilerOptions.strict).toBe(true);
    });

    it('should have proper path aliases configured', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

      expect(tsconfig.compilerOptions.paths).toBeDefined();
      expect(tsconfig.compilerOptions.paths['@/*']).toEqual(['./src/*']);
      expect(tsconfig.compilerOptions.baseUrl).toBe('.');
    });

    it('should target ES2020', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

      expect(tsconfig.compilerOptions.target).toBe('ES2020');
    });

    it('should use react-jsx for JSX transform', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

      expect(tsconfig.compilerOptions.jsx).toBe('react-jsx');
    });

    it('should have noUnusedLocals and noUnusedParameters enabled', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));

      expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true);
      expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true);
    });
  });

  describe('Vite Configuration', () => {
    it('should have vite config file', () => {
      const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
      expect(fs.existsSync(viteConfigPath)).toBe(true);
    });

    it('should contain correct Vite configuration', () => {
      const viteConfigPath = path.join(process.cwd(), 'vite.config.ts');
      const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf-8');

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

  describe('Build Output', () => {
    it('should create dist directory on build', () => {
      const distPath = path.join(process.cwd(), 'dist');
      expect(fs.existsSync(distPath)).toBe(true);
    });

    it('should generate index.html in dist', () => {
      const indexPath = path.join(process.cwd(), 'dist', 'index.html');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    it('should generate JavaScript bundles', () => {
      const distPath = path.join(process.cwd(), 'dist', 'assets');
      const files = fs.readdirSync(distPath);
      const hasJsFiles = files.some(file => file.endsWith('.js'));
      expect(hasJsFiles).toBe(true);
    });

    it('should generate CSS bundles', () => {
      const distPath = path.join(process.cwd(), 'dist', 'assets');
      const files = fs.readdirSync(distPath);
      const hasCssFiles = files.some(file => file.endsWith('.css'));
      expect(hasCssFiles).toBe(true);
    });
  });

  describe('Path Alias Resolution', () => {
    it('should resolve @ alias imports', async () => {
      // This test verifies that TypeScript can resolve @ imports
      const canImport = async (): Promise<boolean> => {
        const module = await import('@/App');
        return module.default !== undefined;
      };

      await expect(canImport()).resolves.toBe(true);
    });
  });
});
