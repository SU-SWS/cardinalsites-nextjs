'use client';

import {usePathname} from 'next/navigation';
import {useEffect} from "react";

/**
 * When the user navigates to another page, get the url.
 */
const useNavigationEvent = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname && !pathname?.startsWith('/gallery/') && window && window.top !== window.self) {
      window.parent.postMessage(
        {type: "NEXT_DRUPAL_ROUTE_SYNC", path: pathname},
        process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string
      )
    }
  }, [pathname]);

  return pathname;
}

export default useNavigationEvent;