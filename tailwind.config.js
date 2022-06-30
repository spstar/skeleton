module.exports = {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'customize-color': '#ff77e9'
      }
    }
  },
  plugins: [require('@tailwindcss/line-clamp')]
};
