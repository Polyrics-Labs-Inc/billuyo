/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        clay: {
          bg: '#FFF7ED',
          surface: '#FFFAF5',
          ink: '#1C1917',
          muted: '#8B8178',
          border: '#E6DDD4',
          'primary': '#8B5CF6',
          'primary-hover': '#7C3AED',
          'primary-light': '#EDE9FE',
          'secondary': '#EC4899',
          'secondary-light': '#FCE7F3',
          'accent-blue': '#0EA5E9',
          'accent-green': '#10B981',
          'accent-amber': '#F59E0B',
          'income': '#10B981',
          'expense': '#F43F5E',
          'savings': '#F59E0B',
        },
      },
      borderRadius: {
        'clay': '20px',
        'clay-sm': '16px',
        'clay-lg': '40px',
        'clay-xl': '60px',
      },
      boxShadow: {
        'clay-card': `
          0 10px 25px -5px rgba(139, 92, 246, 0.10),
          0 8px 10px -6px rgba(0, 0, 0, 0.06),
          inset 0 -3px 6px rgba(255, 255, 255, 0.6),
          inset 0 2px 4px rgba(0, 0, 0, 0.03)
        `,
        'clay-card-hover': `
          0 20px 40px -8px rgba(139, 92, 246, 0.15),
          0 12px 20px -8px rgba(0, 0, 0, 0.08),
          inset 0 -3px 6px rgba(255, 255, 255, 0.7),
          inset 0 2px 4px rgba(0, 0, 0, 0.03)
        `,
        'clay-button': `
          0 8px 16px -4px rgba(139, 92, 246, 0.20),
          0 4px 8px -2px rgba(0, 0, 0, 0.08),
          inset 0 -3px 6px rgba(255, 255, 255, 0.5),
          inset 0 1px 2px rgba(0, 0, 0, 0.03)
        `,
        'clay-pressed': `
          inset 0 4px 8px rgba(0, 0, 0, 0.10),
          inset 0 -3px 6px rgba(255, 255, 255, 0.4),
          0 1px 2px rgba(0, 0, 0, 0.05)
        `,
        'clay-float': `
          0 25px 50px -12px rgba(139, 92, 246, 0.18),
          0 15px 30px -10px rgba(0, 0, 0, 0.08),
          inset 0 -3px 6px rgba(255, 255, 255, 0.5),
          inset 0 2px 4px rgba(0, 0, 0, 0.03)
        `,
        'clay-inset': `
          inset 0 2px 4px rgba(0, 0, 0, 0.06),
          inset 0 -2px 4px rgba(255, 255, 255, 0.5)
        `,
        'clay-nav': `
          0 -4px 20px rgba(139, 92, 246, 0.08),
          0 -1px 4px rgba(0, 0, 0, 0.04)
        `,
      },
      animation: {
        'squish': 'squish 0.15s ease-out',
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite reverse',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        squish: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.94)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}
