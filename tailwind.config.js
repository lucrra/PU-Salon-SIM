/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft neutral with a pink/lavender tint
        ivory: {
          50: '#FFFCFD',
          100: '#FFF7FA',
          200: '#FBEFF6',
          300: '#F3E2EF',
          400: '#E9D2E2',
          500: '#D9BCD0',
        },
        // Primary accent — soft but vivid pink
        champagne: {
          50: '#FFF1F6',
          100: '#FFE4EE',
          200: '#FECDDF',
          300: '#FBA7C6',
          400: '#F472A6',
          500: '#EC4C87',
          600: '#D62D6D',
          700: '#B01D57',
          800: '#8C1746',
          900: '#6E1438',
        },
        // Deep ink with a blue-violet cast
        charcoal: {
          50: '#F5F6FB',
          100: '#E9EBF5',
          200: '#D3D7E9',
          300: '#AEB5D3',
          400: '#808AB8',
          500: '#5E689C',
          600: '#474F7C',
          700: '#353B61',
          800: '#242845',
          900: '#1A1D33',
          950: '#101221',
        },
        // Secondary accent — violet
        gold: {
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        pink: {
          50: '#FFF1F6',
          100: '#FFE4EE',
          200: '#FECDDF',
          300: '#FBA7C6',
          400: '#F472A6',
          500: '#EC4C87',
          600: '#D62D6D',
          700: '#B01D57',
          800: '#8C1746',
          900: '#6E1438',
        },
        blue: {
          50: '#EEF6FF',
          100: '#DBECFF',
          200: '#BEDCFF',
          300: '#91C5FF',
          400: '#5DA6FF',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(70, 45, 90, 0.07), 0 4px 6px -2px rgba(70, 45, 90, 0.03)',
        'card': '0 10px 30px -12px rgba(70, 45, 90, 0.18), 0 2px 8px -4px rgba(70, 45, 90, 0.08)',
        'luxury': '0 24px 50px -20px rgba(60, 30, 80, 0.22), 0 6px 16px -8px rgba(60, 30, 80, 0.10)',
        'glow-pink': '0 10px 30px -10px rgba(236, 76, 135, 0.45)',
        'glow-violet': '0 10px 30px -10px rgba(139, 92, 246, 0.45)',
        'gold': '0 6px 22px -6px rgba(139, 92, 246, 0.35)',
        'inner-soft': 'inset 0 1px 2px rgba(255,255,255,0.6)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .55 },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        fadeUp: 'fadeUp .5s ease-out both',
        shimmer: 'shimmer 2.2s linear infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(135deg, #FFF1F6 0%, #F5F3FF 45%, #EEF6FF 100%)',
        'gradient-brand': 'linear-gradient(135deg, #EC4C87 0%, #A85CF0 55%, #4F8CFF 100%)',
        'gradient-sheen': 'linear-gradient(120deg, rgba(255,255,255,.65), rgba(255,255,255,0) 60%)',
      },
    },
  },
  plugins: [],
}
