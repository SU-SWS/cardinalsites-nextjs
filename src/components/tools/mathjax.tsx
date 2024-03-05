"use client";

import Script from "next/script";
import React from "react";

const Mathjax = () => {
  return (
    <Script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" strategy="lazyOnload"/>
  )
}

export default Mathjax