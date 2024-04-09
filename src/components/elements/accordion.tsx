"use client";

import {HTMLAttributes, JSX, useId} from "react";
import {useBoolean} from "usehooks-ts";
import {H2, H3, H4} from "@components/elements/headers";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

type Props = HTMLAttributes<HTMLElement> & {
  /**
   * Button clickable element or string.
   */
  button: JSX.Element | string
  /**
   * Heading level element.
   */
  headingLevel?: "h2" | "h3" | "h4"
  /**
   * If the accordion should be visible on first render.
   */
  initiallyVisible?: boolean
  /**
   * Button click event if the component is controlled.
   */
  onClick?: () => void
  /**
   * Panel visibility state if the component is controlled.
   */
  isVisible?: boolean
  /**
   * Extra attributes on the button element.
   */
  buttonProps?: HTMLAttributes<HTMLButtonElement>
  /**
   * Extra attributes on the panel element.
   */
  panelProps?: HTMLAttributes<HTMLDivElement>
}

const Accordion = ({
  button,
  children,
  headingLevel = "h2",
  onClick,
  isVisible,
  initiallyVisible = false,
  buttonProps,
  panelProps,
  ...props
}: Props) => {
  const {value: expanded, toggle: toggleExpanded} = useBoolean(initiallyVisible)
  const id = useId();

  const onButtonClick = () => {
    onClick ? onClick() : toggleExpanded()
  }

  // When the accordion is externally controlled.
  const isExpanded = onClick ? isVisible : expanded;

  const Heading = headingLevel === "h2" ? H2 : headingLevel === "h3" ? H3 : H4;
  return (
    <section aria-labelledby={`${id}-button`} {...props}>
      <Heading>
        <button
          {...buttonProps}
          className={twMerge("w-full items-center flex border-b border-transparent hocus:border-black-true", buttonProps?.className)}
          id={`${id}-button`}
          aria-expanded={isExpanded}
          aria-controls={`${id}-panel`}
          onClick={onButtonClick}
        >
          {button}
          <ChevronDownIcon height={30} className={clsx("shrink-0 ml-auto duration-150", {"rotate-180": isExpanded})}/>
        </button>
      </Heading>

      <div
        {...panelProps}
        id={`${id}-panel`}
        className={twMerge(isExpanded ? "block" : "hidden", panelProps?.className)}
        role="region"
        aria-labelledby={`${id}-button`}
      >
        {children}
      </div>
    </section>
  )
}
export default Accordion;