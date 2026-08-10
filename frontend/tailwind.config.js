// File: tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Kept as an extension point — components mostly use arbitrary
        // values ([#111827] etc.) directly since these exact hexes came
        // from the design brief, but named tokens are here if you'd
        // rather standardize later.
        charcoal: '#111827',
        'card-border': '#E5E7EB',
        emerald: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
      },
    },
  },
  plugins: [],
};
