import {HTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";

type Props = HTMLAttributes<HTMLDivElement> & {
  /**
   * If the item is published or not.
   */
  status?: boolean
}
const UnpublishedBanner = ({status, children, ...props}: Props) => {
  if (status !== false) return;
  return (
    <div {...props} className={twMerge("bg-illuminating text-4xl p-5", props.className)}>
      <div className="centered-container">
        {children}
      </div>
    </div>
  )
}
export default UnpublishedBanner;