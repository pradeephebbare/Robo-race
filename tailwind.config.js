/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#07111f',
        panel: '#0f1b2d',
        accent: '#60a5fa',
        electric: '#38bdf8',
        neon: '#7dd3fc',
        warning: '#fbbf24',
        success: '#34d399',
        danger: '#f87171',
      },
      boxShadow: {
        glow: '0 0 30px rgba(96, 165, 250, 0.35)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
