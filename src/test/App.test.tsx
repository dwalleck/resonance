import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Welcome to Resonance!')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<App />);
    expect(screen.getByText('A modern GUI for RyzenAdj built with Tauri + React'))
      .toBeInTheDocument();
  });

  it('renders the input field', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Enter a name...');
    expect(input).toBeInTheDocument();
  });

  it('renders the greet button', () => {
    render(<App />);
    const button = screen.getByText('Greet');
    expect(button).toBeInTheDocument();
  });
});
