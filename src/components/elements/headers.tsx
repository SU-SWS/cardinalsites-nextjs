import {HtmlHTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLHeadingElement>

const headingLinkClasses = "[&_a]:text-digital-red [&_a]:hocus:text-black [&_a]:hocus:underline";

export const H1 = ({children, className, ...props}: Props) => {
  return (
    <h1 className={twMerge(className, "text-m4")} {...props}>
      {children}
    </h1>
  )
}

export const H2 = ({children, className, ...props}: Props) => {
  return (
    <h2 className={twMerge(headingLinkClasses, 'text-m3', className)} {...props}>
      {children}
    </h2>
  )
}

export const H3 = ({children, className, ...props}: Props) => {
  return (
    <h3 className={twMerge(headingLinkClasses, 'text-m2', className)} {...props}>
      {children}
    </h3>
  )
}

export const H4 = ({children, className, ...props}: Props) => {
  return (
    <h4 className={twMerge(headingLinkClasses, 'text-m1', className)} {...props}>
      {children}
    </h4>
  )
}

export const H5 = ({children, className, ...props}: Props) => {
  return (
    <h5 className={twMerge(headingLinkClasses, className)} {...props}>
      {children}
    </h5>
  )
}

export const H6 = ({children, className, ...props}: Props) => {
  return (
    <h6 className={twMerge(headingLinkClasses, className)} {...props}>
      {children}
    </h6>
  )
}

type HeadingProps = Props & {
  level?: number
}

const Heading = ({children, level = 1, ...props}: HeadingProps) => {
  switch (level) {
    case 1:
      return <H1 {...props}>{children}</H1>
    case 2:
      return <H2 {...props}>{children}</H2>
    case 3:
      return <H3 {...props}>{children}</H3>
    case 4:
      return <H4 {...props}>{children}</H4>
    case 5:
      return <H5 {...props}>{children}</H5>
    case 6:
      return <H6 {...props}>{children}</H6>
  }
}
export default Heading;