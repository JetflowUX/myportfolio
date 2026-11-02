import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-ink': 'rgb(var(--accent-ink-rgb) / <alpha-value>)',
        'accent-cold': 'rgb(var(--accent-cold-rgb) / <alpha-value>)',
        'accent-cold-ink': 'rgb(var(--accent-cold-ink-rgb) / <alpha-value>)',
        border: 'var(--border)',
        text: 'var(--text)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        // shadcn names, mapped to the site tokens (used by components/ui/dithered-footer)
        background: 'rgb(var(--bg-rgb) / <alpha-value>)',
        foreground: 'rgb(var(--ink-rgb) / <alpha-value>)',
        'muted-foreground': 'var(--text-secondary)',
        input: 'rgb(var(--ink-rgb) / 0.15)'
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        serif: ['Instrument Serif', 'Baskerville', 'Georgia', 'serif'],
        sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        glow: '0 14px 40px -18px rgb(var(--accent-rgb) / 0.45)'
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        drift: 'drift 20s linear infinite',
        marquee: 'marquee var(--duration) linear infinite',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
        'shimmer-slide': 'shimmer-slide var(--speed) ease-in-out infinite alternate',
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' }
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' }
        },
        'shimmer-slide': {
          to: { transform: 'translate(calc(100cqw - 100%), 0)' }
        },
        'spin-around': {
          '0%': { transform: 'translateZ(0) rotate(0)' },
          '15%, 35%': { transform: 'translateZ(0) rotate(90deg)' },
          '65%, 85%': { transform: 'translateZ(0) rotate(270deg)' },
          '100%': { transform: 'translateZ(0) rotate(360deg)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
