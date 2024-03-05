"use client"

import {HtmlHTMLAttributes} from "react";
import {useIsClient} from "usehooks-ts";

type Props = HtmlHTMLAttributes<HTMLAnchorElement> & {
  /**
   * Email address string.
   */
  email: string
}

const Email = ({email, ...props}: Props) => {
  const isClient = useIsClient();
  if (!isClient) return;

  return (
    <a href={`mailto:${email}`} {...props}>
      {email}
    </a>
  )
}
export default Email