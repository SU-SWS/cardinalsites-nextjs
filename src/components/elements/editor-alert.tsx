import {HTMLAttributes, JSX} from "react"
import {ExclamationTriangleIcon} from "@heroicons/react/20/solid"

type Props = HTMLAttributes<HTMLDivElement> & {
  /**
   * If the item is published or not.
   */
  status?: boolean
  /**
   * Unpublished message.
   */
  message: string | JSX.Element
}
const EditorAlert = ({status, message, children, ...props}: Props) => {
  if (status !== false) return <>{children}</>
  return (
    <div
      {...props}
      className={children ? "border-2 border-dashed border-illuminating" : ""}
    >
      <div className="bg-illuminating p-5 text-4xl font-bold">
        <div className="centered flex items-center gap-10">
          <ExclamationTriangleIcon width={30} />
          {message}
        </div>
      </div>

      {children}
    </div>
  )
}
export default EditorAlert
