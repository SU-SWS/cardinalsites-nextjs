import Image from "next/image"
import Wysiwyg from "@components/elements/wysiwyg"
import Rows from "@components/paragraphs/rows/rows"
import Button from "@components/elements/button"
import {LinkIcon, MapPinIcon, PhoneIcon} from "@heroicons/react/20/solid"
import Telephone from "@components/elements/telephone"
import Email from "@components/elements/email"
import Link from "@components/elements/link"
import {H1, H2} from "@components/elements/headers"
import {HtmlHTMLAttributes} from "react"
import {NodeStanfordPerson} from "@lib/gql/__generated__/drupal.d"
import ReverseVisualOrder from "@components/elements/reverse-visual-order"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPerson
  headingLevel?: "h2" | "h3"
}

const StanfordPersonPage = ({node, ...props}: Props) => {
  const imageUrl = node.suPersonPhoto?.mediaImage.url

  return (
    <article className="centered mt-32" {...props}>
      <div className="mb-32 flex flex-col gap-20 lg:flex-row">
        {imageUrl && (
          <div className="relative mx-auto aspect-[1/1] w-[250px] shrink-0 lg:mx-0">
            <Image
              className="rounded-full"
              src={imageUrl}
              alt=""
              loading="eager"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 900px) 75vw, 1000px"
            />
          </div>
        )}

        <div>
          <ReverseVisualOrder>
            <H1>{node.title}</H1>
            {node.suPersonShortTitle && <div className="mb-10">aa{node.suPersonShortTitle}</div>}
          </ReverseVisualOrder>

          {node.suPersonFullTitle && <div className="type-2">bbb{node.suPersonFullTitle}</div>}
        </div>
      </div>

      <section className="flex flex-col lg:flex-row">
        <div className="flex-1 shrink-0">
          <Wysiwyg html={node.body?.processed} />

          <Rows components={node.suPersonComponents} />

          {node.suPersonEducation && (
            <div className="mb-10">
              <H2 className="type-2">Education</H2>
              {node.suPersonEducation.map((education, i) => (
                <div key={`${node.id}-education-${i}`}>{education}</div>
              ))}
            </div>
          )}

          {node.suPersonResearch && (
            <div className="mb-10">
              <H2 className="type-2">Research</H2>
              <div className="grid grid-cols-2 gap-10">
                {node.suPersonResearch.map((research, i) => (
                  <Wysiwyg key={`${node.id}-research-${i}`} html={research.processed} />
                ))}
              </div>
            </div>
          )}

          {node.suPersonAffiliations && (
            <div className="mb-10">
              <H2 className="type-2">Stanford Affiliations</H2>
              <div className="grid grid-cols-2 gap-10">
                {node.suPersonAffiliations.map((affiliation, i) => (
                  <div key={`${node.id}-affiliation-${i}`}>
                    <Button href={affiliation.url}>{affiliation.title}</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <aside className="w-1/3 shrink-0">
          {(node.suPersonTelephone ||
            node.suPersonMobilePhone ||
            node.suPersonFax ||
            node.suPersonEmail ||
            node.suPersonMailCode) && (
            <div className="mb-20 flex items-start gap-10">
              <PhoneIcon width={30} className="shrink-0" />
              <div>
                <H2 className="type-2">Contact</H2>

                {node.suPersonTelephone && (
                  <div className="mb-10">
                    p: <Telephone tel={node.suPersonTelephone} />
                  </div>
                )}
                {node.suPersonMobilePhone && (
                  <div className="mb-10">
                    m: <Telephone tel={node.suPersonMobilePhone} />
                  </div>
                )}

                {node.suPersonFax && (
                  <div className="mb-10">
                    f: <Telephone tel={node.suPersonFax} />
                  </div>
                )}

                {node.suPersonEmail && (
                  <div className="mb-10">
                    <Email email={node.suPersonEmail} />
                  </div>
                )}

                {node.suPersonMailCode && <div className="mb-10">Mail Code: {node.suPersonMailCode}</div>}
              </div>
            </div>
          )}

          {(node.suPersonLocationAddress || node.suPersonMapUrl) && (
            <div className="mb-20 flex items-start gap-10">
              <MapPinIcon width={30} className="shrink-0" />
              <div>
                <H2 className="type-2">Location</H2>

                <Wysiwyg html={node.suPersonLocationAddress?.processed} />

                {node.suPersonMapUrl?.url && (
                  <div>
                    Map URL:{" "}
                    <Link href={node.suPersonMapUrl.url}>{node.suPersonMapUrl.title || node.suPersonMapUrl.url}</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {node.suPersonLinks && (
            <div className="mb-20 flex items-start gap-10">
              <LinkIcon width={30} className="shrink-0" />
              <div>
                <H2 className="type-2">Links</H2>
                {node.suPersonLinks.map((link, i) => {
                  if (!link.url) return
                  return (
                    <Link key={`${node.id}-link-${i}`} href={link.url}>
                      {link.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {node.suPersonProfileLink?.url && (
            <Button href={node.suPersonProfileLink.url}>{node.suPersonProfileLink.title}</Button>
          )}
        </aside>
      </section>
    </article>
  )
}
export default StanfordPersonPage
