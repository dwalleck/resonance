// Test script to verify theme switching functionality
// Run this in the browser console while the app is running

console.log('Testing theme switching...');

// Check initial theme
const html = document.documentElement;
const initialHasDarkClass = html.classList.contains('dark');
console.log('Initial dark class present:', initialHasDarkClass);

// Check CSS variables
const styles = getComputedStyle(document.body);
const bgColor = styles.getPropertyValue('--color-background');
const fgColor = styles.getPropertyValue('--color-foreground');
console.log('Background color:', bgColor);
console.log('Foreground color:', fgColor);

// Find and click theme toggle button
const themeToggle = document.querySelector('[aria-label*="Switch to"]');
if (themeToggle) {
  console.log('Theme toggle button found');
  themeToggle.click();

  setTimeout(() => {
    const newHasDarkClass = html.classList.contains('dark');
    console.log('After toggle - dark class present:', newHasDarkClass);
    console.log('Theme switched successfully:', initialHasDarkClass !== newHasDarkClass);

    // Check if localStorage was updated
    const savedTheme = localStorage.getItem('theme');
    console.log('Saved theme in localStorage:', savedTheme);
  }, 100);
} else {
  console.error('Theme toggle button not found');
}
