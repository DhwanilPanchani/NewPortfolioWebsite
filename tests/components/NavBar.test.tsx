import { render, screen, fireEvent } from '@testing-library/react';
import NavBar from '@/app/components/core/NavBar';

// Mock the ThemeProvider
jest.mock('@/app/components/core/ThemeProvider', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
}));

describe('NavBar', () => {
  it('renders the logo', () => {
    render(<NavBar />);
    expect(screen.getByText('DP')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<NavBar />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('opens mobile menu when menu button is clicked', () => {
    render(<NavBar />);
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    // Mobile menu should be visible
    const mobileMenu = screen.getAllByText('Home');
    expect(mobileMenu.length).toBeGreaterThan(1);
  });

  it('has correct links for navigation items', () => {
    render(<NavBar />);
    const homeLink = screen.getAllByText('Home')[0].closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});