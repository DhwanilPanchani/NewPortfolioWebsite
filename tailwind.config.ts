import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './data/**/*.ts'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#05060A',
          900: '#080A10',
          800: '#0D1018',
          700: '#141824',
        },
        phosphor: '#C8FF4D',
        signal: '#5EE7FF',
        flare: '#FF5C7A',
        fg: {
          DEFAULT: '#E9ECF2',
          dim: '#8A90A0',
          faint: '#4A5060',
        },
        line: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
        pulseDot: {
          '0%': { boxShadow: '0 0 0 0 rgba(200,255,77,0.6)' },
          '100%': { boxShadow: '0 0 0 10px rgba(200,255,77,0)' },
        },
        packetX: {
          '0%': { left: '0%', opacity: '0' },
          '10%, 90%': { opacity: '1' },
          '100%': { left: '100%', opacity: '0' },
        },
        packetY: {
          '0%': { top: '0%', opacity: '0' },
          '10%, 90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        pulseDot: 'pulseDot 1.8s ease-out infinite',
        packetX: 'packetX 1.8s cubic-bezier(.5,0,.5,1) infinite',
        packetY: 'packetY 1.8s cubic-bezier(.5,0,.5,1) infinite',
        scan: 'scan 5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
