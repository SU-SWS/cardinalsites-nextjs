import {HTMLAttributes} from "react"

import cn from "@lib/utils/className"

type Props = HTMLAttributes<HTMLElement> & {
  label: string
}

const InputGroup = ({label, children, ...props}: Props) => {
  return (
    <fieldset
      {...props}
      className={cn("mb-10 max-h-96 space-y-3 overflow-y-auto overflow-x-hidden pb-5", props.className)}
    >
      <legend className="mb-10 w-full border-t border-black pt-10 font-semibold">{label}</legend>

      {children}
    </fieldset>
  )
}

export default InputGroup
