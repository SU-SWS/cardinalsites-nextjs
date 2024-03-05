// @ts-nocheck
module.exports = function () {
  return function ({addComponents}) {
    const components = {
      '.local-footer': {
        'h2': {
          fontSize: '1.5em',
        },
        'h3': {
          fontSize: '1.3em',
        },
        'h4': {
          fontSize: '1.1em',
        }
      },
    };

    addComponents(components);
  };
};