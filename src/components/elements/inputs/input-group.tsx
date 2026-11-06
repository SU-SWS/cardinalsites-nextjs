import {HTMLAttributes} from "react"

import cn from "@lib/utils/className"

type Props = HTMLAttributes<HTMLElement> & {
  label: string
}

const InputGroup = ({label, children, ...props}: Props) => {
  return (
    <fieldset {...props} className={cn("mb-20", props.className)}>
      <legend className="mb-20 w-full border-t border-black pt-20 font-semibold">{label}</legend>

      {/* Long option lists scroll on their own so the legend stays in view. Spacing units are px. The bottom padding
          leaves room for the radio outlines so short lists don't show a scrollbar. */}
      <div className="max-h-384 space-y-3 overflow-x-hidden overflow-y-auto pb-10">{children}</div>
    </fieldset>
  )
}

export default InputGroup
