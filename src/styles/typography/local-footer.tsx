// @ts-nocheck
module.exports = function () {
  return function ({addComponents}) {
    const components = {
      '.local-footer': {
        'h2': {
          fontSize: '.9em',
        },
        'h3': {
          fontSize: '.8em',
        },
        'h4': {
          fontSize: '.8em',
        },
        'p': {
          fontSize: '.8em',
        }
      },
    };

    addComponents(components);
  };
};