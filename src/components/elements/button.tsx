import cn from "@lib/utils/className"
import {HtmlHTMLAttributes, MouseEventHandler} from "react"
import {Maybe} from "@lib/gql/__generated__/graphql"
import {LinkProps} from "next/dist/client/link"
import Link from "next/link"
import {getLinkHref} from "@components/elements/link"

export type ButtonProps = HtmlHTMLAttributes<HTMLAnchorElement | HTMLButtonElement> & {
  /**
   * Link URL.
   */
  href?: Maybe<string>
  /**
   * If the element should be a <button>, default is <a>.
   */
  buttonElem?: boolean
  /**
   * Display a larger button.
   */
  big?: boolean
  /**
   * Display a secondary styled button.
   */
  secondary?: boolean
  /**
   * Center the button in the container.
   */
  centered?: boolean
  /**
   * Click handler, mostly when using a button element.
   */
  onClick?: MouseEventHandler
  /**
   * Next.js prefetch functionality.
   */
  prefetch?: LinkProps["prefetch"]
  /**
   * Type of button: submit, reset, or button.
   */
  type?: HTMLButtonElement["type"]
  /**
   * Disabled button element.
   */
  disabled?: boolean
}

export const Button = ({
  href,
  buttonElem = false,
  big = false,
  secondary = false,
  centered = false,
  children,
  className,
  ...props
}: ButtonProps) => {
  const standardClasses = cn({
    "mx-auto flex w-fit items-center": centered,
    "inline-block w-fit text-center": !centered,
    "btn btn--big bg-digital-red px-24 py-12 text-5xl font-normal text-white no-underline transition hocus:bg-black hocus:text-white hocus:underline":
      big && !secondary,
    "btn btn--secondary border-2 border-digital-red px-16 py-8 font-normal text-digital-red no-underline transition hocus:border-black hocus:underline":
      !big && secondary,
    "btn btn--big btn--secondary border-2 border-digital-red px-24 py-12 text-5xl font-normal text-digital-red no-underline transition hocus:border-black hocus:underline":
      big && secondary,
    "btn bg-digital-red px-16 py-8 font-normal text-white no-underline transition hocus:bg-black hocus:text-white hocus:underline":
      !big && !secondary,
  })

  if (!href || buttonElem) {
    return (
      <button className={cn(standardClasses, className)} type="button" {...props}>
        {children}
      </button>
    )
  }

  return (
    <Link href={getLinkHref(href)} className={cn(standardClasses, className)} {...props}>
      {children}
    </Link>
  )
}

export default Button
