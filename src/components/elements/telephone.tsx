"use client"

import {HtmlHTMLAttributes} from "react";
import {useIsClient} from "usehooks-ts";

type Props = HtmlHTMLAttributes<HTMLAnchorElement> & {
  tel: string
}

const Telephone = ({tel, ...props}: Props) => {
  const isClient = useIsClient();
  if (!isClient) return;
  return (

    <a href={`tel:${tel.replace(/[^\d]+/g, '')}`} {...props}>
      {tel}
    </a>
  )
}
export default Telephone