import {BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon} from "@heroicons/react/20/solid"
import {H2} from "@components/elements/headers"
import Wysiwyg from "@components/elements/wysiwyg"
import Link from "@components/elements/link"
import {clsx} from "clsx"
import {StanfordGlobalMessage} from "@lib/gql/__generated__/drupal.d"
import {getConfigPage} from "@lib/gql/gql-queries"
import {twMerge} from "tailwind-merge"

const GlobalMessage = async () => {
  const globalMessageConfig = await getConfigPage<StanfordGlobalMessage>("StanfordGlobalMessage")
  if (!globalMessageConfig?.suGlobalMsgEnabled) return

  const WrapperElement = globalMessageConfig.suGlobalMsgHeader ? "article" : "div"

  return (
    <WrapperElement
      aria-labelledby={globalMessageConfig.suGlobalMsgHeader ? globalMessageConfig.id : undefined}
      className={twMerge(
        "py-10",
        clsx({
          "bg-digital-blue-dark text-white": globalMessageConfig.suGlobalMsgType === "info",
          "bg-illuminating-dark": globalMessageConfig.suGlobalMsgType === "warning",
          "bg-digital-green text-white": globalMessageConfig.suGlobalMsgType === "success",
          "bg-foggy-light": globalMessageConfig.suGlobalMsgType === "plain",
          "bg-digital-red text-white": globalMessageConfig.suGlobalMsgType === "error",
        })
      )}
    >
      <div className="centered flex flex-col gap-10 lg:flex-row">
        <div className="flex shrink-0 items-center leading-none">
          <MessageIcon messageType={globalMessageConfig.suGlobalMsgType} />
          {globalMessageConfig.suGlobalMsgLabel}:
        </div>
        <div>
          {globalMessageConfig.suGlobalMsgHeader && <H2 id={globalMessageConfig.id}>{globalMessageConfig.suGlobalMsgHeader}</H2>}

          <Wysiwyg
            html={globalMessageConfig.suGlobalMsgMessage?.processed}
            className={twMerge(
              "[&_a.btn]:border-2 [&_a]:no-underline [&_a]:hocus:underline",
              clsx({
                "[&_a.btn]:border-white [&_a.btn]:bg-transparent [&_a]:text-white": !["warning", "plain"].includes(globalMessageConfig.suGlobalMsgType),
                "[&_a.btn]:border-black [&_a.btn]:bg-transparent [&_a]:text-black [&_a]:hocus:text-black": ["warning", "plain"].includes(globalMessageConfig.suGlobalMsgType),
              })
            )}
          />

          {globalMessageConfig.suGlobalMsgLink?.url && (
            <Link
              href={globalMessageConfig.suGlobalMsgLink.url}
              className={twMerge(
                "no-underline hocus:underline",
                clsx({
                  "text-white hocus:text-white": !["warning", "plain"].includes(globalMessageConfig.suGlobalMsgType),
                  "text-black hocus:text-black": ["warning", "plain"].includes(globalMessageConfig.suGlobalMsgType),
                })
              )}
            >
              {globalMessageConfig.suGlobalMsgLink.title}
            </Link>
          )}
        </div>
      </div>
    </WrapperElement>
  )
}

const MessageIcon = ({messageType}: {messageType: StanfordGlobalMessage["suGlobalMsgType"]}) => {
  switch (messageType) {
    case "info":
      return <InformationCircleIcon width={40} />
    case "success":
      return <CheckCircleIcon width={40} />
    case "plain":
      return <BellIcon width={40} />
  }
  return <ExclamationTriangleIcon width={40} />
}

export default GlobalMessage
