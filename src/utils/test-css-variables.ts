// Utility to test CSS variables are properly defined
export function testCSSVariables(): Record<string, boolean> {
  const results: Record<string, boolean> = {};

  // List of CSS variables we expect to be defined
  const expectedVariables = [
    '--color-background',
    '--color-foreground',
    '--color-card',
    '--color-card-foreground',
    '--color-primary',
    '--color-primary-foreground',
    '--color-secondary',
    '--color-secondary-foreground',
    '--color-muted',
    '--color-muted-foreground',
    '--color-accent',
    '--color-accent-foreground',
    '--color-destructive',
    '--color-destructive-foreground',
    '--color-border',
    '--color-input',
    '--color-ring',
    '--radius-sm',
    '--radius-base',
    '--radius-md',
    '--radius-lg',
    '--radius-xl',
    '--font-sans',
    '--font-mono',
  ];

  const styles = getComputedStyle(document.documentElement);

  expectedVariables.forEach(variable => {
    const value = styles.getPropertyValue(variable);
    results[variable] = value !== '';
  });

  return results;
}

// Function to test theme switching
export function testThemeSwitch(): {
  initial: string;
  afterToggle: string;
  success: boolean;
} {
  const html = document.documentElement;
  const initial = html.classList.contains('dark') ? 'dark' : 'light';

  // Find and click theme toggle
  const themeToggle = document.querySelector('[aria-label*="Switch to"]') as HTMLButtonElement;

  if (!themeToggle) {
    return { initial, afterToggle: initial, success: false };
  }

  themeToggle.click();

  const afterToggle = html.classList.contains('dark') ? 'dark' : 'light';

  return {
    initial,
    afterToggle,
    success: initial !== afterToggle,
  };
}

// Function to test responsive classes
export function testResponsiveClasses(): Record<string, boolean> {
  const results: Record<string, boolean> = {};

  // Check if responsive utility classes exist
  const responsiveElements = {
    'hidden sm:block': document.querySelector('.hidden.sm\\:block'),
    'hidden lg:block': document.querySelector('.hidden.lg\\:block'),
    'grid-cols-1': document.querySelector('.grid-cols-1'),
    'sm:grid-cols-2': document.querySelector('.sm\\:grid-cols-2'),
    'lg:grid-cols-3': document.querySelector('.lg\\:grid-cols-3'),
  };

  Object.entries(responsiveElements).forEach(([className, element]) => {
    results[className] = element !== null;
  });

  return results;
}
