/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  mode: 'jit',
  theme: {
    extend: {
      backgroundImage: {
        gradientBottom: 'linear-gradient(0deg,#000,rgba(0,0,0,.5) 35%,transparent 70%)',
        gradientLeft: 'linear-gradient(270deg,#000,rgba(0,0,0,.1) 10%,transparent 70%)',
        gradientRight: 'linear-gradient(90deg,#000,rgba(0,0,0,.1) 10%,transparent 70%)',
        gradientTop: 'linear-gradient(180deg,#000,rgba(0,0,0,.5) 35%,transparent 70%)'
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif']
      },
      colors: {
        textGray: '#999999',
        textGray2: '#E0E0E0'
      },
      gridTemplateColumns: {
        custom: '350px 1fr'
      }
    },
    plugins: []
  }

}
