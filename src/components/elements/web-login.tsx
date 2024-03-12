"use client";

import {ChevronUpIcon, LockClosedIcon} from "@heroicons/react/20/solid";
import Link from "next/link";

const WebLogin = () => {
  return (
    <div className=" border-t border-black-20 my-5 mb-5 pt-9">
      <Link href="/saml/login?destination=/" className="button">
        Web Login
        <LockClosedIcon width={20} className="ml-2 inline-block"/>
      </Link>
    </div>
  )
}
export default WebLogin;