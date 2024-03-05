"use client";

import {useEffect, useState} from "react";
import FacebookIcon from "@components/elements/icons/FacebookIcon";
import LinkedInIcon from "@components/elements/icons/LinkedInIcon";
import TwitterIcon from "@components/elements/icons/TwitterIcon";
import {EnvelopeIcon} from "@heroicons/react/24/outline";
import {PrinterIcon} from "@heroicons/react/20/solid";
import {usePathname} from "next/navigation";
import {useIsClient} from "usehooks-ts";

const SocialIcons = ({...props}) => {
  const [subject, setSubject] = useState<string>('')
  useEffect(() => setSubject(document.title), []);
  const path = usePathname()
  const isClient = useIsClient()

  if (!isClient) return null;

  return (
    <div {...props}>
      <a
        href={`http://www.facebook.com/sharer.php?u=${path}&display=popup`}
        className="text-black hocus:text-digital-blue transition">
        <FacebookIcon/>
        <span className="sr-only">Facebook</span>
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${path}&text=`}
        className="text-black hocus:text-digital-blue transition">
        <TwitterIcon/>
        <span className="sr-only">Twitter</span>
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${path}&title=&summary=`}
        className="text-black hocus:text-digital-blue transition"
      >
        <LinkedInIcon/>
        <span className="sr-only">LinkedIn</span>
      </a>
      <a
        href={`mailto:?subject=${subject}&body=${path}`}
        className="text-black hocus:text-digital-blue transition"
      >
        <EnvelopeIcon width={30}/>
        <span className="sr-only">Email</span>
      </a>
      <button
        onClick={() => window.print()}
        className="text-black hocus:text-digital-blue transition"
      >
        <PrinterIcon width={30}/>
        <span className="sr-only">Print</span>
      </button>
    </div>
  )
}
export default SocialIcons;