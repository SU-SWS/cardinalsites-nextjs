import cn from "@lib/utils/className"
import {HTMLAttributes, RefObject} from "react"

type Props = HTMLAttributes<HTMLButtonElement> & {
  ref: RefObject<HTMLButtonElement | null>
  open: boolean
}
const Hamburger = ({open, children, ...props}: Props) => (
  <button className="group absolute top-5 right-10 z-10 flex flex-col items-center lg:hidden" {...props}>
    <span className="flex h-30 w-25 flex-col items-center justify-center">
      <span
        className={cn("block h-3 w-full rounded-xs bg-black-true transition-all duration-300 ease-out", {
          "translate-y-9 rotate-45": open,
          "-translate-y-0.5": !open,
        })}
      />
      <span
        className={cn("my-6 block h-3 w-full rounded-xs bg-black-true transition-all duration-300 ease-out", {
          "opacity-0": open,
          "opacity-100": !open,
        })}
      />
      <span
        className={cn("block h-3 w-full rounded-xs bg-black-true transition-all duration-300 ease-out", {
          "-translate-y-8 -rotate-45": open,
          "translate-y-0.5": !open,
        })}
      />
    </span>
    {children}
  </button>
)
export default Hamburger
