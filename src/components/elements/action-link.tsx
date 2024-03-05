import Link from "@components/elements/link";
import {ChevronRightIcon} from "@heroicons/react/20/solid";
import {HtmlHTMLAttributes} from "react";

type Props = HtmlHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

const ActionLink = ({children, ...props}: Props) => {
  return (
    <Link {...props} className="relative">
      {children}
      <ChevronRightIcon height={25} className="ml-2 inline-block"/>
    </Link>
  )
}
export default ActionLink;