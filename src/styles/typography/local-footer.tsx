// @ts-nocheck
module.exports = function () {
  return function ({addComponents}) {
    const components = {
      ".local-footer": {
        "h2": {
          fontSize: "1em",
        },
        "h3": {
          fontSize: ".9em",
        },
        "h4": {
          fontSize: ".9em",
        },
        "p": {
          fontSize: ".9em",
        }
      },
    };

    addComponents(components);
  };
};