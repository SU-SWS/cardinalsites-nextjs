"use client"

import Script from "next/script";
import {useEffect} from "react";

const Editori11y = () => {

  const startEditoria11y = () => {
    // @ts-ignore
    if (typeof Ed11y != "undefined") {
      // @ts-ignore
      new Ed11y({
        checkRoots: "#main-content",
        ignoreElements: "nav",
        allowHide: false,
        allowOK: false,
      });
    }
  }

  useEffect(() => {
    fetch("/api/draft/disable", {cache: "no-store"})
  }, [])

  return (
    <Script src="//cdn.jsdelivr.net/gh/itmaybejj/editoria11y@2/dist/editoria11y.min.js" onReady={startEditoria11y}/>
  )
}

export default Editori11y;