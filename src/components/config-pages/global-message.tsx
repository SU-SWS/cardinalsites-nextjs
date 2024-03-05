import {BellIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon} from "@heroicons/react/20/solid";
import {H2} from "@components/elements/headers";
import Wysiwyg from "@components/elements/wysiwyg";
import Link from "@components/elements/link";
import {clsx} from "clsx";
import {StanfordGlobalMessage} from "@lib/gql/__generated__/drupal.d";

const GlobalMessage = ({
  suGlobalMsgEnabled,
  suGlobalMsgType,
  suGlobalMsgLabel,
  suGlobalMsgHeader,
  suGlobalMsgLink,
  suGlobalMsgMessage
}: StanfordGlobalMessage) => {
  if (!suGlobalMsgEnabled) return;

  const wrapperClasses = clsx({
    'bg-digital-blue-dark text-white': suGlobalMsgType === 'info',
    'bg-illuminating-dark': suGlobalMsgType === 'warning',
    'bg-digital-green text-white': suGlobalMsgType === 'success',
    'bg-foggy-light': suGlobalMsgType === 'plain',
    'bg-digital-red text-white': suGlobalMsgType === 'error',
  });

  return (
    <div className={wrapperClasses + " py-10"}>
      <div className="centered flex flex-col lg:flex-row gap-10">
        <div className="flex items-center leading-none shrink-0">
          <MessageIcon messageType={suGlobalMsgType}/>
          {suGlobalMsgLabel}:
        </div>
        <div className="[&_a]:text-white [&_a.btn]:bg-transparent [&_a.btn]:border-2 [&_a.btn]:border-white">
          {suGlobalMsgHeader && <H2>{suGlobalMsgHeader}</H2>}

          <Wysiwyg html={suGlobalMsgMessage?.processed}/>

          {suGlobalMsgLink?.url &&
            <Link href={suGlobalMsgLink.url} className="text-white">
              {suGlobalMsgLink.title}
            </Link>
          }
        </div>
      </div>
    </div>
  )
}

const MessageIcon = ({messageType}: { messageType: StanfordGlobalMessage['suGlobalMsgType'] }) => {
  switch (messageType) {
    case 'info':
      return <InformationCircleIcon width={40}/>
    case 'success':
      return <CheckCircleIcon width={40}/>
    case 'plain':
      return <BellIcon width={40}/>;
  }
  return <ExclamationTriangleIcon width={40}/>;
}

export default GlobalMessage;