"use client";

import {SignalIcon} from "@heroicons/react/20/solid";
import Embed from "react-tiny-oembed";
import {HtmlHTMLAttributes} from "react";
import {useIntersectionObserver} from "usehooks-ts";

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  url: string
}

const Oembed = ({url, ...props}: Props) => {
  const {isIntersecting, ref} = useIntersectionObserver({freezeOnceVisible: true})
  return (
    <div {...props} ref={ref} className="relative aspect-[16/9] w-full">
      {isIntersecting && <Embed url={url} LoadingFallbackElement={<Loading/>}/>}
    </div>
  )
}

const Loading = () => {
  return (
    <div className="h-full w-full flex items-baseline">
      <SignalIcon className="mx-auto animate-ping self-center" width={30} height={30}/>
    </div>
  )
}

export default Oembed;