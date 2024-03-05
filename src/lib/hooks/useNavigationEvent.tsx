'use client';

import {usePathname} from 'next/navigation';
import {useEffect, useState} from "react";

const useNavigationEvent = () => {
  const [url, setUrl] = useState<string>();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname !== url && !(pathname?.startsWith('/gallery-image/'))) {
      setUrl(pathname);

      if (pathname && window && window.top !== window.self) {
        // console.log('pathname', pathname);
        window.parent.postMessage(
          {type: "NEXT_DRUPAL_ROUTE_SYNC", path: pathname},
          process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string
        )
      }
    }
  }, [url, pathname]);

  return url;
}

export default useNavigationEvent;