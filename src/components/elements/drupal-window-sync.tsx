"use client";

import {usePathname} from "next/navigation";
import {useEffect} from "react";

const DrupalWindowSync = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (
      pathname &&
      !pathname?.startsWith('/gallery/') &&
      window &&
      window.top !== window.self
    ) {
      window.parent.postMessage({type: "NEXT_DRUPAL_ROUTE_SYNC", path: pathname}, process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string)
    }
  }, [pathname]);
  return null;
}

export default DrupalWindowSync