"use client"

import {Select} from "@base-ui/react/select"
import {ReactNode} from "react"
import {ChevronDownIcon, CheckIcon} from "@heroicons/react/20/solid"
import cn from "@lib/utils/className"
import {SelectRootProps} from "@base-ui/react/select"

export type SelectOption = {
  value: string
  label: string | ReactNode
}

interface Props<Value, Multiple extends boolean | undefined = false> extends Omit<
  SelectRootProps<Value, Multiple>,
  "items"
> {
  items?: SelectOption[]
  label?: string
  emptyValue?: string
  emptyLabel?: string
  className?: string
}

const SelectList = ({
  items = [],
  label,
  emptyValue,
  className,
  emptyLabel = "- None -",
  required,
  ...props
}: Props<string, true>) => {
  const options = !required && emptyLabel ? [{value: emptyValue || "", label: emptyLabel}, ...items] : [...items]
  return (
    <div className={cn("m-2 w-full max-w-[350px]", className)}>
      <Select.Root items={options} required={required} {...props}>
        <Select.Label className="text-4xl font-semibold">{label}</Select.Label>
        <Select.Trigger className="flex w-full items-center rounded border border-black-50 p-4 text-4xl shadow-lg">
          <Select.Value className="" placeholder={emptyLabel} />
          <Select.Icon className="ml-auto">
            <ChevronDownIcon width={20} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Positioner className="z-10" align="start">
            <Select.Popup className="">
              <Select.List className="max-h-[300px] min-w-[200px] overflow-y-auto border border-black-20 bg-white p-5 shadow-lg">
                {options.map(item => (
                  <Option key={item.value} value={item.value} label={item.label} />
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}

const Option = ({value, label}: {value: string | number; label: string | ReactNode}) => {
  return (
    <Select.Item
      value={value}
      className="group mb-3 flex cursor-pointer items-center gap-3 border-b border-black-20 p-2 last:mb-0 last:border-0 hocus:underline"
    >
      <Select.ItemIndicator keepMounted className="flex h-7 w-7 items-center rounded border border-black">
        <CheckIcon width={20} className="mx-auto hidden w-5 group-aria-selected:block" />
      </Select.ItemIndicator>
      <Select.ItemText className="">{label}</Select.ItemText>
    </Select.Item>
  )
}

export default SelectList
