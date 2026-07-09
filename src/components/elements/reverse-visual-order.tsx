import cn from "@lib/utils/className"
import {HTMLAttributes} from "react"

const ReverseVisualOrder = ({children, ...props}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} className={cn("flex flex-col-reverse", props.className)}>
      {children}
    </div>
  )
}
export default ReverseVisualOrder
