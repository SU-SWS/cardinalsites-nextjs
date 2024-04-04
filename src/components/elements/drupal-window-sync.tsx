"use client";

import {usePathname} from "next/navigation";
import {useIsClient} from "usehooks-ts";

const DrupalWindowSync = () => {
  const pathname = usePathname();
  if (!useIsClient()) return;

  if (
    pathname &&
    !pathname?.startsWith("/gallery/") &&
    !pathname?.startsWith("/preview") &&
    window &&
    window.top !== window.self
  ) {
    window.parent.postMessage({
      type: "NEXT_DRUPAL_ROUTE_SYNC",
      path: pathname
    }, process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)
  }
  return null;
}

export default DrupalWindowSync