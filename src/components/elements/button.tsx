import Link from "@components/elements/link"
import {twMerge} from "tailwind-merge"
import {HtmlHTMLAttributes, MouseEventHandler} from "react"
import {Maybe} from "@lib/gql/__generated__/drupal.d"
import {clsx} from "clsx"

type Props = HtmlHTMLAttributes<HTMLAnchorElement | HTMLButtonElement> & {
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
  prefetch?: boolean
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
}: Props) => {
  const standardClasses = clsx({
    "flex items-center w-fit mx-auto": centered,
    "inline-block text-center w-fit": !centered,
    "btn btn--big transition text-5xl text-white hocus:text-white bg-digital-red hocus:bg-black no-underline hocus:underline py-6 px-12 font-normal":
      big && !secondary,
    "btn btn--secondary transition text-digital-red border-2 border-digital-red hocus:border-black no-underline hocus:underline py-4 px-8 font-normal":
      !big && secondary,
    "btn  btn--big btn--secondary transition text-5xl text-digital-red border-2 border-digital-red hocus:border-black no-underline hocus:underline py-6 px-12 font-normal":
      big && secondary,
    "btn bg-digital-red font-normal text-white hocus:bg-black hocus:text-white py-4 px-8 no-underline hocus:underline transition":
      !big && !secondary,
  })

  if (!href || buttonElem) {
    return (
      <button className={twMerge(standardClasses, className)} type="button" {...props}>
        {children}
      </button>
    )
  }

  return (
    <Link href={href} className={twMerge(standardClasses, className)} {...props}>
      {children}
    </Link>
  )
}

export default Button
