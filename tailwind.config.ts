import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Coffee/Brown Theme
        primary: {
          50: '#faf8f5',
          100: '#f0e9e0',
          200: '#e0d4c3',
          300: '#c9b59a',
          400: '#b39771',
          500: '#8B6F47',  // Main brand coffee brown
          600: '#6f5839',
          700: '#5a452d',
          800: '#473524',
          900: '#3a2b1e',
        },
        // Dark Theme Colors
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',  // Main background
          950: '#020617',
        },
        // Accent Colors
        accent: {
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
          coffee: '#6B4423',
          cream: '#DCC9B3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #8B6F47 0%, #6B4423 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(139, 111, 71, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(139, 111, 71, 0.6)' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 111, 71, 0.4)',
        'glow-lg': '0 0 40px rgba(139, 111, 71, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        'glass': '16px',
      },
    },
  },
  plugins: [],
};

export default config;
