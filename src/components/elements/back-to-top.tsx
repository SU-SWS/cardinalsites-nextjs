"use client";

import Button from "@components/elements/button";
import {ChevronUpIcon} from "@heroicons/react/20/solid";
import {useBoolean, useDebounceCallback, useEventListener} from "usehooks-ts";
import {useCallback} from "react";

const BackToTop = () => {
  const {value, setFalse, setTrue} = useBoolean(false)

  const onScroll = useCallback(() => {
    if (window.scrollY > 1500) setTrue();
    if (window.scrollY <= 1500) setFalse();
  }, [setTrue, setFalse])

  useEventListener('scroll', useDebounceCallback(onScroll, 200))

  return (
    <Button
      buttonElem
      className={"fixed bottom-10 right-10 transition-all duration-300 " + (value ? "opacity-100 visible" : "opacity-0 invisible")}
      onClick={() => scrollTo({
        left: 0,
        top: 0,
        behavior: !!window.matchMedia('(prefers-reduced-motion: reduce)')?.matches ? 'instant' : 'smooth'
      })}
    >
      <span className="block flex gap-2">
        <ChevronUpIcon width={30}/>Return to Top
      </span>
    </Button>
  )
}
export default BackToTop;