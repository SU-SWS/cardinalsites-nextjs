import {extendTailwindMerge} from "tailwind-merge"
// eslint-disable-next-line no-restricted-imports
import {ClassValue, clsx} from "clsx"

// Creates an array containing type-# classes from 0 to 1
const typeClasses = Array.from({length: 10}, (_, i) => `type-${i}`)
// Creates an array containing text-# classes from 11 to 30
const textClasses = Array.from({length: 20}, (_, i) => `text-${i + 11}`)

const typographyClasses = [...textClasses, ...typeClasses]

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": typographyClasses,
      m: [(value: string) => value.startsWith("rs-m-")],
      mt: [(value: string) => value.startsWith("rs-mt-")],
      mb: [(value: string) => value.startsWith("rs-mb-")],
      ml: [(value: string) => value.startsWith("rs-ml-")],
      mr: [(value: string) => value.startsWith("rs-mr-")],
      mx: [(value: string) => value.startsWith("rs-mx-")],
      my: [(value: string) => value.startsWith("rs-my-")],
      ms: [(value: string) => value.startsWith("rs-ms-")],
      me: [(value: string) => value.startsWith("rs-me-")],
      p: [(value: string) => value.startsWith("rs-p-")],
      pt: [(value: string) => value.startsWith("rs-pt-")],
      pb: [(value: string) => value.startsWith("rs-pb-")],
      pl: [(value: string) => value.startsWith("rs-pl-")],
      pr: [(value: string) => value.startsWith("rs-pr-")],
      px: [(value: string) => value.startsWith("rs-px-")],
      py: [(value: string) => value.startsWith("rs-py-")],
      ps: [(value: string) => value.startsWith("rs-ps-")],
      pe: [(value: string) => value.startsWith("rs-pe-")],
    },
  },
})

const cn = (...inputs: ClassValue[]) => {
  return customTwMerge(clsx(inputs))
}

export default cn
