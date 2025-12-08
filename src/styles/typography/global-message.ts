// @ts-nocheck
export const globalMessageStyles = ({addUtilities, theme}) =>{
  addUtilities({
    ".global-message": {
      a: {
        color: theme("colors.white"),
      },
      "a:hover, a:focus": {
        color: theme("colors.black"),
      },
    },
  })
}
