/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F5F2EB',
          300: '#EDE7DC',
          400: '#E2D8C7',
          500: '#D5C7B0',
        },
        champagne: {
          50: '#FAF7F2',
          100: '#F5EFE4',
          200: '#EADCC8',
          300: '#DFC8A8',
          400: '#D3B487',
          500: '#C5A880',
          600: '#B8935A',
          700: '#9B7642',
          800: '#7E5B31',
          900: '#644623',
        },
        charcoal: {
          50: '#F6F6F6',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#636363',
          600: '#484848',
          700: '#333333',
          800: '#242424',
          900: '#1A1A1A',
          950: '#111111',
        },
        gold: {
          400: '#E5C158',
          500: '#D4AF37',
          600: '#B89225',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'luxury': '0 10px 30px -5px rgba(26, 26, 26, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'gold': '0 4px 20px -2px rgba(197, 168, 128, 0.25)',
      }
    },
  },
  plugins: [],
}
