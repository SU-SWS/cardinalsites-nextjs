import {extendTailwindMerge} from "tailwind-merge"

// Creates an array containing type-# classes from 0 to 1
const typeClasses = Array.from({length: 10}, (_, i) => `type-${i}`)
// Creates an array containing text-# classes from 11 to 30
const textClasses = Array.from({length: 20}, (_, i) => `text-${i + 11}`)

const typographyClasses = [...textClasses, ...typeClasses]

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": typographyClasses,
    },
  },
})

export default twMerge
