import {RefObject} from "react";
import {useOnClickOutside} from "usehooks-ts";

/**
 * Perform some function when the user clicks, touches, or focuses outside a given element.
 *
 * @param ref
 *   Html Element container.
 * @param onClickOutside
 *   Function to trigger on outside click.
 */
const useOutsideClick = (ref: RefObject<HTMLElement>, onClickOutside: () => void) => {
  useOnClickOutside(ref, onClickOutside, "mousedown")
  useOnClickOutside(ref, onClickOutside, "touchstart")

  // @ts-ignore Focus in event works the same way as mousedown.
  // @see https://github.com/juliencrn/usehooks-ts/discussions/522
  useOnClickOutside(ref, onClickOutside, "focusin")
}

export default useOutsideClick;