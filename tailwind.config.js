/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B2A4A',
        dusk: '#2E4159',
        amber: '#E8A33D',
        amberDark: '#C7852A',
        cream: '#FAF7F2',
        slate: '#5B6472',
        line: '#E4DED2',
        sage: '#54735A',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
