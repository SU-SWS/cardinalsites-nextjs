import {HTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";
import {ExclamationTriangleIcon} from "@heroicons/react/20/solid";

type Props = HTMLAttributes<HTMLDivElement> & {
  /**
   * If the item is published or not.
   */
  status?: boolean
}
const UnpublishedBanner = ({status, children, ...props}: Props) => {
  if (status !== false) return;
  return (
    <div {...props} className={twMerge("bg-illuminating font-bold text-4xl p-5", props.className)}>
      <div className="centered-container flex items-center gap-10">
        <ExclamationTriangleIcon width={30}/>
        {children}
      </div>
    </div>
  )
}
export default UnpublishedBanner;