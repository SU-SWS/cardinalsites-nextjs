import {ChevronRightIcon} from "@heroicons/react/20/solid"
import {HtmlHTMLAttributes} from "react"
import cn from "@lib/utils/className"
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
    <Link {...props} href={getLinkHref(href)} className={cn("group relative pr-25", props.className)}>
      {children}
      <ChevronRightIcon height={25} className="ml-4 inline-block transition-all group-hocus-visible:translate-x-1" />
    </Link>
  )
}
export default ActionLink
