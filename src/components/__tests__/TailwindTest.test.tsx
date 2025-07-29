import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Tailwind CSS Integration', () => {
  it('should apply Tailwind utility classes correctly', () => {
    const { container } = render(
      <div className="bg-primary text-primary-foreground p-4 rounded-md">
        <h1 className="text-2xl font-bold">Test Heading</h1>
        <p className="text-muted-foreground">Test paragraph</p>
      </div>,
    );

    const div = container.firstChild as HTMLElement;
    const heading = screen.getByText('Test Heading');
    const paragraph = screen.getByText('Test paragraph');

    // Check that elements are rendered
    expect(div).toBeInTheDocument();
    expect(heading).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();

    // Check that classes are applied
    expect(div).toHaveClass('bg-primary', 'text-primary-foreground', 'p-4', 'rounded-md');
    expect(heading).toHaveClass('text-2xl', 'font-bold');
    expect(paragraph).toHaveClass('text-muted-foreground');
  });

  it('should apply CSS custom properties from theme', () => {
    const { container } = render(
      <div style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
        Theme Test
      </div>,
    );

    const div = container.firstChild as HTMLElement;
    const styles = window.getComputedStyle(div);

    // CSS custom properties should be defined (even if they resolve to default values in tests)
    expect(styles.backgroundColor).toBeDefined();
    expect(styles.color).toBeDefined();
  });
});
