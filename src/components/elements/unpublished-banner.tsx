import {HTMLAttributes} from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  status?: boolean
}
const UnpublishedBanner = ({status, children, ...props}: Props) => {
  if (status !== false) return;
  return (
    <div className="bg-illuminating text-4xl p-5" {...props}>
      <div className="centered-container">
        {children}
      </div>
    </div>
  )
}
export default UnpublishedBanner;