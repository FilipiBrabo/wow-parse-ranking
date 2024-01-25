const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { fontFamily } = require('tailwindcss/defaultTheme');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  safelist: [
    'text-rank-gold',
    'text-rank-pink',
    'text-rank-orange',
    'text-rank-purple',
    'text-rank-green',
    'text-rank-blue',
    'text-rank-gray',
    'text-death-knight',
    'text-druid',
    'text-hunter',
    'text-mage',
    'text-paladin',
    'text-priest',
    'text-rogue',
    'text-shaman',
    'text-warlock',
    'text-warrior',
  ],
  theme: {
    extend: {
      colors: {
        // WCL rank colors
        'rank-gold': 'hsl(var(--rank-gold))',
        'rank-pink': 'hsl(var(--rank-pink))',
        'rank-orange': 'hsl(var(--rank-orange))',
        'rank-purple': 'hsl(var(--rank-purple))',
        'rank-blue': 'hsl(var(--rank-blue))',
        'rank-green': 'hsl(var(--rank-green))',
        'rank-gray': 'hsl(var(--rank-gray))',

        'death-knight': 'hsl(var(--death-knight))',
        druid: 'hsl(var(--druid))',
        hunter: 'hsl(var(--hunter))',
        mage: 'hsl(var(--mage))',
        paladin: 'hsl(var(--paladin))',
        priest: 'hsl(var(--priest))',
        rogue: 'hsl(var(--rogue))',
        shaman: 'hsl(var(--shaman))',
        warlock: 'hsl(var(--warlock))',
        warrior: 'hsl(var(--warrior))',

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
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
