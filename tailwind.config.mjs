/** @type {import('tailwindcss').Config} */
export default {
  content: ['./frontend/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'selector',
  theme: {
    extend: {},
    borderRadius: {
      sm: '0.375rem',
      DEFAULT: '0.5625rem',
      md: '0.6875rem',
      lg: '0.8125rem'
    }
  },
  plugins: []
}
