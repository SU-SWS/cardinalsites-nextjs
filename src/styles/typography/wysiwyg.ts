// @ts-nocheck
export const wysiwygStyles = ({addComponents}) => {
  addComponents({
    ".wysiwyg": {
      "> :first-child": {
        marginTop: "0",
      },
    },
  })
}
