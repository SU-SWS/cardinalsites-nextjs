"use client";

import {useWindowScroll} from "@uidotdev/usehooks";
import Button from "@components/elements/button";
import {ChevronUpIcon} from "@heroicons/react/20/solid";

const BackToTop = () => {
  const [{y}, scrollTo] = useWindowScroll();
  const showButton = (y && y > 1500);
  return (
    <Button
      buttonElem
      className={"fixed bottom-10 right-10 transition-all duration-300 " + (showButton ? "opacity-100 visible" : "opacity-0 invisible")}
      onClick={() => scrollTo({left: 0, top: 0, behavior: "smooth"})}
    >
      <span className="block flex gap-2">
        <ChevronUpIcon width={30}/>Return to Top
      </span>
    </Button>
  )
}
export default BackToTop;