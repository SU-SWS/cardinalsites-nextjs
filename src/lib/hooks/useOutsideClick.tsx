import {RefObject} from "react";
import {useOnClickOutside} from "usehooks-ts";

const useOutsideClick = (ref: RefObject<HTMLElement>, onClickOutside: () => void) => {
  useOnClickOutside(ref, onClickOutside, "mousedown")
  useOnClickOutside(ref, onClickOutside, "touchstart")

  // @ts-ignore Focus in event works the same way as mousedown.
  // @see https://github.com/juliencrn/usehooks-ts/discussions/522
  useOnClickOutside(ref, onClickOutside, "focusin")
}

export default useOutsideClick;