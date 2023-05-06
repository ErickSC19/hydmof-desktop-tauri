/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        usm: '412px',
        '2k': '1440px',
        '4k': '2560px'
      },
      colors: {
        secondary: {
          50: 'rgb(245, 249, 227)',
          100: 'rgb(235, 243, 200)',
          200: 'rgb(214, 231, 144)',
          300: 'rgb(184, 214, 65)',
          400: 'rgb(152, 180, 39)',
          500: 'rgb(122, 145, 31)',
          600: 'rgb(98, 116, 25)',
          700: 'rgb(86, 102, 22)',
          800: 'rgb(67, 80, 17)',
          900: 'rgb(56, 66, 14)'
        },
        primary: {
          50: 'rgb(252, 245, 249)',
          100: 'rgb(249, 235, 243)',
          200: 'rgb(243, 216, 231)',
          300: 'rgb(235, 189, 215)',
          400: 'rgb(222, 144, 188)',
          500: 'rgb(208, 97, 160)',
          600: 'rgb(188, 56, 131)',
          700: 'rgb(165, 49, 115)',
          800: 'rgb(130, 39, 91)',
          900: 'rgb(107, 32, 75)'
        }
      },
      fontSize: {
        '4m5xl': '2.7rem'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
};
