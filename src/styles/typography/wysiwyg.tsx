// @ts-nocheck
module.exports = function () {
  return function ({addComponents}) {

    const components = {
      '.wysiwyg': {
        '> :first-child': {
          marginTop: '0'
        }
      },
    };

    addComponents(components);
  };
};