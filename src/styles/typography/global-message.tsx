// @ts-nocheck
module.exports = function () {
  return function ({addUtilities, theme}) {
    const components = {
      '.global-message': {
        'a': {
          color: theme('colors.white'),
        },
        'a:hover, a:focus': {
          color: theme('colors.black'),
        }
      },
    };
    addUtilities(components);
  };
};