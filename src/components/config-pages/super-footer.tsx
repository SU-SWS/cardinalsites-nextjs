import Wysiwyg from "@components/elements/wysiwyg"
import Link from "@components/elements/link"
import {LockClosedIcon} from "@heroicons/react/24/outline"
import {H2} from "@components/elements/headers"
import {StanfordSuperFooter} from "@lib/gql/__generated__/drupal.d"

const SuperFooter = ({suSuperFootEnabled, suSuperFootTitle, suSuperFootText, suSuperFootLink, suSuperFootIntranet}: StanfordSuperFooter) => {
  if (!suSuperFootEnabled) return

  return (
    <div className="border-b border-black-20 bg-foggy-light py-20">
      <div className="centered flex justify-between">
        <div className="flex-1">
          {suSuperFootTitle && <H2 className="text-m2">{suSuperFootTitle}</H2>}

          <Wysiwyg html={suSuperFootText?.processed} />
        </div>

        <div className="flex-1 text-right">
          <div className="inline-block">
            {suSuperFootLink && (
              <>
                {suSuperFootLink.map((link, index) => {
                  if (!link.url) return
                  return (
                    <Link
                      key={`super-footer-link-${index}`}
                      href={link.url}
                      className="mb-5 block border border-black-20 bg-white p-10 text-digital-red no-underline shadow-lg transition last:mb-0 hocus:bg-black hocus:text-white hocus:underline"
                    >
                      {link.title}
                    </Link>
                  )
                })}
              </>
            )}

            {suSuperFootIntranet?.url && (
              <Link
                href={suSuperFootIntranet.url}
                className="flex items-center text-digital-red no-underline hocus:text-black hocus:underline"
              >
                {suSuperFootIntranet.title}
                <LockClosedIcon
                  width={20}
                  className="ml-2"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default SuperFooter
