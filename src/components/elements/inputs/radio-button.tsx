import {ChangeEvent, HTMLAttributes} from "react"
import cn from "@lib/utils/className"

type Props = HTMLAttributes<HTMLLabelElement> & {
  value: string | number
  name?: string
  inputProps?: HTMLAttributes<HTMLInputElement>
  onRadioChange?: (_e: ChangeEvent<HTMLInputElement>) => void
}
const RadioButton = ({value, name, onRadioChange, inputProps, children, ...props}: Props) => {
  return (
    <label {...props} className={cn("group flex cursor-pointer items-center gap-5", props.className)}>
      <input
        {...inputProps}
        onChange={onRadioChange}
        type="radio"
        value={value}
        name={name}
        className="peer relative -left-[999px] h-0 w-0"
      />
      <span className="realtive m-1 block h-10 w-10 rounded-full border-3 border-white outline outline-1 outline-black transition-colors peer-checked:bg-black peer-hover:bg-cardinal-red peer-focus-visible:bg-cardinal-red" />
      <span className="block peer-hover:underline peer-focus-visible:underline">{children}</span>
    </label>
  )
}
export default RadioButton
