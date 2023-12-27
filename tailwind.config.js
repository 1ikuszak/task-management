const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    'bg-theme-blue-primary',
    'text-theme-blue-primary',
    'bg-theme-blue-secondary',
    'text-theme-blue-secondary',
    'bg-theme-blue-bg',
    'text-theme-blue-bg',

    'bg-theme-green-primary',
    'text-theme-green-primary',
    'bg-theme-green-secondary',
    'text-theme-green-secondary',
    'bg-theme-green-bg',
    'text-theme-green-bg',

    'bg-theme-rose-primary',
    'text-theme-rose-primary',
    'bg-theme-rose-secondary',
    'text-theme-rose-secondary',
    'bg-theme-rose-bg',
    'text-theme-rose-bg',

    'bg-theme-default-primary',
    'text-theme-default-primary',
    'bg-theme-default-secondary',
    'text-theme-default-secondary',
    'bg-theme-default-bg',
    'text-theme-default-bg',

    'bg-theme-green-primary',
    'text-theme-green-primary',
    'bg-theme-green-secondary',
    'text-theme-green-secondary',
    'bg-theme-green-bg',
    'text-theme-green-bg',

    'bg-theme-orange-primary',
    'text-theme-orange-primary',
    'bg-theme-orange-secondary',
    'text-theme-orange-secondary',
    'bg-theme-orange-bg',
    'text-theme-orange-bg',

    // Add other custom classes as needed
  ],
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        agGrid: ['var(--font-sans)', ...fontFamily.sans],
      },
      fontSize: {
        agGrid: '12px',
      },
      colors: {
        agGrid: {
          foreground: 'hsl(var(--foreground))',
          background: 'hsl(var(--background))',
          headerForeground: 'hsl(var(--primary))',
          headerBackground: 'hsl(var(--background))',
          oddRowBackground: 'hsl(var(--background))',
          headerColumnResizeHandle: 'hsl(var(--muted))',
        },
        'theme-blue': {
          primary: '#2563eb',
          secondary: '#60a5fa',
          bg: '#dbeafe',
        },
        'theme-green': {
          primary: '#16a34a',
          secondary: '#4ade80',
          bg: '#dcfce7',
        },
        'theme-rose': {
          primary: '#e11d48',
          secondary: '#fb7185',
          bg: '#ffe4e6',
        },
        'theme-orange': {
          primary: '#ea580c',
          secondary: '#fb923c',
          bg: '#ffedd5',
        },
        'theme-default': {
          primary: 'hsl(var(--primary))',
          secondary: 'hsl(var(--muted-foreground))',
          bg: 'hsl(var(--secondary))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
