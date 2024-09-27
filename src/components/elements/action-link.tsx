import Link from "@components/elements/link"
import {ChevronRightIcon} from "@heroicons/react/20/solid"
import {HtmlHTMLAttributes} from "react"
import twMerge from "@lib/utils/twMerge"

type Props = HtmlHTMLAttributes<HTMLAnchorElement> & {
  /**
   * Link url.
   */
  href: string
}

const ActionLink = ({children, ...props}: Props) => {
  return (
    <Link {...props} className={twMerge("group relative", props.className)}>
      {children}
      <ChevronRightIcon height={25} className="ml-2 inline-block transition-all group-hocus-visible:translate-x-2" />
    </Link>
  )
}
export default ActionLink
