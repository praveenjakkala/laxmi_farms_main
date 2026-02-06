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
        // Primary Colors - Deep Maroon & Wine
        primary: {
          50: '#fdf2f4',
          100: '#fce8eb',
          200: '#f8c9d0',
          300: '#f3a3af',
          400: '#e86b7d',
          500: '#d73a53',
          600: '#722F37', // Main maroon
          700: '#5c252c',
          800: '#4d2025',
          900: '#411c21',
          950: '#240c0f',
        },
        // Accent Colors - Earthy Tones
        accent: {
          beige: '#F5F0E6',
          cream: '#FDF8F3',
          earth: '#A67B5B',
          terracotta: '#C4785C',
          sand: '#E8DCC9',
        },
        // Natural Colors
        natural: {
          green: '#4A5D23',
          olive: '#6B7B3A',
          brown: '#6B4423',
          wood: '#8B5E3C',
          leaf: '#557A46',
        },
        // Neutral & Background
        warm: {
          50: '#FFFBF7',
          100: '#FDF8F3',
          200: '#F9F0E6',
          300: '#F0E4D6',
          400: '#E3D4C1',
          500: '#D4C3AB',
          600: '#B8A385',
          700: '#9A8465',
          800: '#7A6449',
          900: '#5C4A33',
        },
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url('/images/grain-texture.png')",
        'farm-pattern': "url('/images/farm-pattern.svg')",
        'hero-gradient': 'linear-gradient(135deg, #722F37 0%, #8B3A3A 50%, #A67B5B 100%)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(114, 47, 55, 0.15)',
        'glass-lg': '0 25px 50px -12px rgba(114, 47, 55, 0.25)',
        'warm': '0 4px 20px 0 rgba(166, 123, 91, 0.15)',
        'card': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 40px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
