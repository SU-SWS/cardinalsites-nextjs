"use client"

import {HtmlHTMLAttributes} from "react"
import {useIsClient} from "usehooks-ts"
import {EnvelopeIcon} from "@heroicons/react/24/outline"
import cn from "@lib/utils/className"

type Props = HtmlHTMLAttributes<HTMLAnchorElement> & {
  /**
   * Email address string.
   */
  email: string
}

const Email = ({email, ...props}: Props) => {
  const isClient = useIsClient()
  if (!isClient) return

  return (
    <a href={`mailto:${email}`} {...props}>
      {email}
      <EnvelopeIcon width={20} className="ml-6 inline-block" />
    </a>
  )
}
export default Email
