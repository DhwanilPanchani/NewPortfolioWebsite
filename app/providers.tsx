'use client';

import { ThemeProvider } from './components/core/ThemeProvider';
import NavBar from './components/core/NavBar';
import Footer from './components/core/Footer';
import ScrollProgress from './components/ui/ScrollProgress';
import CookieConsent from './components/ui/CookieConsent';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ScrollProgress />
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CookieConsent />
    </ThemeProvider>
  );
}