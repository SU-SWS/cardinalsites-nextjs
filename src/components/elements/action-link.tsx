import Link from "@components/elements/link";
import {ChevronRightIcon} from "@heroicons/react/20/solid";
import {HtmlHTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";

type Props = HtmlHTMLAttributes<HTMLAnchorElement> & {
  /**
   * Link url.
   */
  href: string
}

const ActionLink = ({children, ...props}: Props) => {
  return (
    <Link {...props} className={twMerge("relative", props.className)}>
      {children}
      <ChevronRightIcon height={25} className="ml-2 inline-block"/>
    </Link>
  )
}
export default ActionLink;