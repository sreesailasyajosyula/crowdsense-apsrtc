/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#1D4ED8',
          700: '#1E40AF',
        },
        ink: '#1E293B',
        card: '#F8FAFC',
        admin: {
          bg: '#0F172A',
          sidebar: '#020617',
          card: '#1E293B',
          border: '#334155',
          hover: '#1D4ED8',
          text: '#E2E8F0',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Telugu', 'system-ui', 'sans-serif'],
        telugu: ['Noto Sans Telugu', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
