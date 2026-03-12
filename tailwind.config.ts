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
        bg: 'var(--bg)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        text: 'var(--text)'
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        sans: ['Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        glow: '0 14px 40px -18px rgba(0, 255, 194, 0.45)'
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        drift: 'drift 20s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
