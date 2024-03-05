import Wysiwyg from "@components/elements/wysiwyg";
import Link from "@components/elements/link";
import {LockClosedIcon} from "@heroicons/react/24/outline";
import {H2} from "@components/elements/headers";
import {StanfordSuperFooter} from "@lib/gql/__generated__/drupal.d";

const SuperFooter = ({suSuperFootEnabled, suSuperFootTitle, suSuperFootText, suSuperFootLink, suSuperFootIntranet}: StanfordSuperFooter ) => {
  if (!suSuperFootEnabled) return

  return (
    <div className="py-20 bg-foggy-light border-b border-black-20">
      <div className="centered flex justify-between">
        <div className="flex-1">
          {suSuperFootTitle &&
            <H2 className="text-m2">{suSuperFootTitle}</H2>
          }

          <Wysiwyg html={suSuperFootText?.processed}/>
        </div>

        <div className="flex-1 text-right">
          <div className="inline-block">
            {suSuperFootLink &&
              <>
                {suSuperFootLink.map((link, index) => {
                  if (!link.url) return;
                  return (
                    <Link
                      key={`super-footer-link-${index}`} href={link.url}
                      className="border border-black-20 block shadow-lg p-10 mb-5 bg-white text-digital-red no-underline hocus:bg-black hocus:text-white hocus:underline transition last:mb-0"
                    >
                      {link.title}
                    </Link>
                  )
                })}
              </>
            }

            {suSuperFootIntranet?.url &&
              <Link
                href={suSuperFootIntranet.url}
                className="flex items-center text-digital-red no-underline hocus:text-black hocus:underline"
              >
                {suSuperFootIntranet.title}
                <LockClosedIcon width={20} className="ml-2"/>
              </Link>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
export default SuperFooter;