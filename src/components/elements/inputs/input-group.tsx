import {HTMLAttributes} from "react"

import cn from "@lib/utils/className"

type Props = HTMLAttributes<HTMLElement> & {
  label: string
}

const InputGroup = ({label, children, ...props}: Props) => {
  return (
    <fieldset
      {...props}
      className={cn("mb-20 max-h-96 space-y-3 overflow-x-hidden overflow-y-auto pb-10", props.className)}
    >
      <legend className="mb-20 w-full border-t border-black pt-20 font-semibold">{label}</legend>

      {children}
    </fieldset>
  )
}

export default InputGroup
