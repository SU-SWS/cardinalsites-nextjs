/** @type {import('tailwindcss').Config} */

const decanter = require('decanter');

const path = require('path');
const dir = path.resolve(__dirname, 'src/styles');

let twoColumn = {}, threeColumn = {}, i;
for (i = 1; i <= 4; i++) {
  twoColumn[`1-${i}`] = `minmax(0, 1fr) minmax(0, ${i}fr)`;
  twoColumn[`${i}-1`] = `minmax(0, ${i}fr) minmax(0, 1fr)`;
}

for (i = 1; i <= 4; i++) {
  threeColumn[`${i}-1-1`] = `minmax(0, ${i}fr) minmax(0, 1fr) minmax(0, 1fr)`;
  threeColumn[`1-${i}-1`] = `minmax(0, 1fr) minmax(0, ${i}fr) minmax(0, 1fr)`;
  threeColumn[`1-1-${i}`] = `minmax(0, 1fr) minmax(0, 1fr) minmax(0, ${i}fr)`;
}

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: decanter.theme.fontFamily,
    decanter: decanter.theme.decanter,
    screens: decanter.theme.screens,
    extend: {
      ...decanter.theme.extend,
      screens: {
        "3xl": "1600px",
      },
      gridTemplateColumns: {...twoColumn, ...threeColumn},
      containers: {
        '9xl': '90rem',
        '10xl': '100rem',
        '11xl': '110rem',
        '12xl': '120rem',
        '13xl': '130rem',
        '14xl': '140rem',
        '15xl': '150rem',
      },
      scale: {
        '-100': '-1'
      }
    },
  },
  plugins: [
    ...decanter.plugins,
    require('@tailwindcss/container-queries'),
    require(`${dir}/typography/local-footer.tsx`)(),
    require(`${dir}/typography/global-message.tsx`)(),
    require(`${dir}/typography/wysiwyg.tsx`)(),
    require(`${dir}/centered-container.tsx`)(),
  ],
};
