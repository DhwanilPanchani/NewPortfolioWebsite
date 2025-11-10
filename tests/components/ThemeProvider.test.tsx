import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/app/components/core/ThemeProvider';

// Test component that uses the theme
function TestComponent() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides theme context to children', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toBeInTheDocument();
  });

  it('defaults to dark theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('toggles theme when button is clicked', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const button = screen.getByText('Toggle Theme');
    const themeDisplay = screen.getByTestId('theme');

    expect(themeDisplay).toHaveTextContent('dark');
    fireEvent.click(button);
    expect(themeDisplay).toHaveTextContent('light');
    fireEvent.click(button);
    expect(themeDisplay).toHaveTextContent('dark');
  });

  it('persists theme to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const button = screen.getByText('Toggle Theme');
    fireEvent.click(button);
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
  });
});