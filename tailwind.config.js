/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0a0a0a',
          neon: '#00e400',
          electric: '#28d931ff',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,255,136,0.25), 0 0 24px #6843b5',
        glowStrong:
          '0 0 0 1px rgba(0,255,136,0.35), 0 0 36px #6843b5',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(800px circle at var(--x, 50%) var(--y, 0%), #6843b5, transparent 55%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(120%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 600ms ease-out both',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
