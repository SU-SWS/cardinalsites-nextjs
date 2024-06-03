"use client";

import {
  useSelect,
  SelectOptionDefinition,
  SelectProvider,
  SelectValue,
} from "@mui/base/useSelect";
import { useOption } from "@mui/base/useOption";
import {
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  RefObject,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Maybe } from "@lib/gql/__generated__/drupal.d";

interface OptionProps {
  rootRef: RefObject<HTMLUListElement>;
  children?: ReactNode;
  value: string;
  disabled?: boolean;
}

const renderSelectedValue = (
  value: SelectValue<string, boolean>,
  options: SelectOptionDefinition<string>[],
) => {
  if (Array.isArray(value)) {
    return value.map((item) => (
      <span
        key={item}
        className="mb-2 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded bg-archway p-5 text-white"
      >
        {renderSelectedValue(item, options)}
      </span>
    ));
  }
  const selectedOption = options.find((option) => option.value === value);
  return selectedOption ? selectedOption.label : null;
};

function CustomOption(props: OptionProps) {
  const { children, value, rootRef, disabled = false } = props;
  const { getRootProps, highlighted, selected } = useOption({
    rootRef: rootRef,
    value,
    disabled,
    label: children,
  });

  const { id, ...otherProps }: { id: string } = getRootProps();
  const selectedStyles =
    "bg-archway text-white " + (highlighted ? "underline" : "");
  const highlightedStyles = "bg-black-10 text-black underline";

  useEffect(() => {
    if (highlighted && id && rootRef?.current?.parentElement) {
      const item = document.getElementById(id);
      if (item) {
        const itemTop = item?.offsetTop;
        const itemHeight = item?.offsetHeight;
        const parentScrollTop = rootRef.current.parentElement.scrollTop;
        const parentHeight = rootRef.current.parentElement.offsetHeight;

        if (itemTop < parentScrollTop) {
          rootRef.current.parentElement.scrollTop = itemTop;
        }

        if (itemTop + itemHeight > parentScrollTop + parentHeight) {
          rootRef.current.parentElement.scrollTop =
            itemTop - parentHeight + itemHeight;
        }
      }
    }
  }, [rootRef, id, highlighted]);

  return (
    <li
      {...otherProps}
      id={id}
      className={
        "m-0 mb-2 cursor-pointer overflow-hidden px-10 py-2 hocus:underline " +
        (selected
          ? selectedStyles
          : highlighted
            ? highlightedStyles
            : "hocus:bg-black-10 hocus:text-black")
      }
    >
      {children}
    </li>
  );
}

interface Props {
  options: SelectOptionDefinition<string>[];
  label?: Maybe<string>;
  ariaLabelledby?: Maybe<string>;
  defaultValue?: SelectValue<string, boolean>;
  onChange?: (
    _event: MouseEvent | KeyboardEvent | FocusEvent | null,
    _value: SelectValue<string, boolean>,
  ) => void;
  multiple?: boolean;
  disabled?: boolean;
  value?: SelectValue<string, boolean>;
  required?: boolean;
  emptyValue?: Maybe<string>;
  emptyLabel?: Maybe<string>;
  name?: Maybe<string>;
}

const SelectList = ({
  options = [],
  label,
  multiple,
  ariaLabelledby,
  required,
  defaultValue,
  name,
  emptyValue,
  emptyLabel = "- None -",
  ...props
}: Props) => {
  const labelId = useId();
  const labeledBy = ariaLabelledby || labelId;

  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const [listboxVisible, setListboxVisible] = useState<boolean>(false);

  const { getButtonProps, getListboxProps, contextValue, value } = useSelect<
    string,
    boolean
  >({
    listboxRef,
    onOpenChange: setListboxVisible,
    open: listboxVisible,
    defaultValue,
    multiple,
    ...props,
  });

  useEffect(() => listboxRef.current?.focus(), [listboxVisible]);

  useLayoutEffect(() => {
    const parentContainer =
      listboxRef.current?.parentElement?.getBoundingClientRect();
    if (
      parentContainer &&
      (parentContainer.bottom > window.innerHeight || parentContainer.top < 0)
    ) {
      listboxRef.current?.parentElement?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [listboxVisible, value]);

  const optionChosen = multiple && value ? value.length > 0 : !!value;

  return (
    <div className="relative h-fit">
      <button
        {...getButtonProps()}
        className="w-full rounded border border-black-40 p-5 text-left"
        aria-labelledby={labeledBy}
      >
        <div className="flex flex-wrap justify-between">
          {label && (
            <div
              className={
                "relative " +
                (optionChosen ? "top-[-15px] w-full text-m0" : "text-m1")
              }
            >
              <div id={labelId} className="w-fit bg-white px-5">
                {label}
              </div>
            </div>
          )}
          {optionChosen && (
            <div className="max-w-[calc(100%-30px)] overflow-hidden">
              {renderSelectedValue(value, options)}
            </div>
          )}

          <ChevronDownIcon width={20} className="flex-shrink-0" />
        </div>
      </button>

      <div
        className={
          "absolute left-0 top-full z-[10] max-h-[300px] w-full overflow-y-scroll border border-black-20 bg-white pb-5 shadow-lg " +
          (listboxVisible ? "" : "hidden")
        }
      >
        <ul
          {...getListboxProps()}
          className={"list-unstyled " + (listboxVisible ? "" : "hidden")}
          aria-hidden={!listboxVisible}
          aria-labelledby={labeledBy}
        >
          <SelectProvider value={contextValue}>
            {!required && !multiple && (
              <CustomOption value={emptyValue || ""} rootRef={listboxRef}>
                {emptyLabel}
              </CustomOption>
            )}

            {options.map((option) => {
              return (
                <CustomOption
                  key={option.value}
                  value={option.value}
                  rootRef={listboxRef}
                >
                  {option.label}
                </CustomOption>
              );
            })}
          </SelectProvider>
        </ul>
      </div>
      {name && (
        <input ref={inputRef} name={name} type="hidden" value={value || ""} />
      )}
    </div>
  );
};

export default SelectList;
