import {CheckIcon} from "@heroicons/react/16/solid"
import {ChangeEvent, HTMLAttributes, InputHTMLAttributes} from "react"
import cn from "@lib/utils/className"

type Props = HTMLAttributes<HTMLLabelElement> & {
  value?: string | number
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  onChange?: (_e: ChangeEvent<HTMLInputElement>) => void
}
const CheckboxButton = ({value, onChange, inputProps, children, ...props}: Props) => {
  return (
    <label {...props} className={cn("group flex cursor-pointer items-center gap-10", props.className)}>
      <input
        {...inputProps}
        onChange={onChange}
        type="checkbox"
        value={value}
        className="peer relative -left-999 h-0 w-0"
      />
      <span className="block h-10 w-10 rounded-[0.3rem] border border-black peer-checked:hidden peer-focus-visible:bg-cardinal-red" />
      <CheckIcon
        className="hidden rounded-[0.3rem] border border-black peer-checked:block peer-focus-visible:bg-cardinal-red peer-focus-visible:text-white"
        width={25}
      />
      <span className="block peer-hover:underline peer-focus-visible:underline">{children}</span>
    </label>
  )
}
export default CheckboxButton
