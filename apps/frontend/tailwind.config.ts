import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'nexus-dark':    '#060D17',
        'nexus-mid':     '#0D1B2A',
        'nexus-surface': '#111D2E',
        'nexus-cyan':    '#00D4FF',
        'nexus-amber':   '#F7B731',
        'nexus-purple':  '#9B30FF',
        'nexus-green':   '#00FF94',
      },
      fontFamily: {
        sans:     ['Space Grotesk', 'sans-serif'],
        mono:     ['JetBrains Mono', 'monospace'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'float':     'float 4s ease-in-out infinite',
        'pulse-cyan': 'pulse-cyan 2s ease-in-out infinite',
      },
      backgroundImage: {
        'grid-cyan': `linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '48px 48px',
      },
    },
  },
  plugins: [],
};

export default config;
