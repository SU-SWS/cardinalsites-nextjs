import {ChevronRightIcon} from "@heroicons/react/20/solid"
import {HtmlHTMLAttributes} from "react"
import twMerge from "@lib/utils/twMerge"
import Link from "next/link"
import {getLinkHref} from "@components/elements/link"

type Props = HtmlHTMLAttributes<HTMLAnchorElement> & {
  /**
   * Link url.
   */
  href: string
}

const ActionLink = ({href, children, ...props}: Props) => {
  return (
    <Link {...props} href={getLinkHref(href)} className={twMerge("group relative pr-[25px]", props.className)}>
      {children}
      <ChevronRightIcon height={25} className="ml-2 inline-block transition-all group-hocus-visible:translate-x-1" />
    </Link>
  )
}
export default ActionLink
