import Wysiwyg from "@components/elements/wysiwyg"
import StanfordPolicyCard from "@components/nodes/cards/stanford-policy/stanford-policy-card"
import StringWithLines from "@components/elements/string-with-lines"
import {HtmlHTMLAttributes, Suspense} from "react"
import {H1, H2, H3} from "@components/elements/headers"
import {BookLink, Maybe, NodeStanfordPolicy} from "@lib/gql/__generated__/drupal.d"
import {getEntityFromPath} from "@lib/gql/gql-queries"
import {ImageCardSkeleton} from "@components/patterns/image-card"
import InteriorPage from "@components/layouts/interior-page"
import Button from "@components/elements/button"
import {ChevronLeftIcon} from "@heroicons/react/16/solid"
import {ChevronRightIcon} from "@heroicons/react/20/solid"
import StanfordPolicyListItem from "@components/nodes/list-item/stanford-policy/stanford-policy-list-item"

type Props = HtmlHTMLAttributes<HTMLDivElement> & {
  node: NodeStanfordPolicy
  headingLevel?: "h2" | "h3"
}

const StanfordPolicyPage = async ({node, ...props}: Props) => {
  const changeLog = node.suPolicyChangelog?.filter(change => change.suPolicyPublic) || []

  let flattenedMenu: BookLink[] = []
  const flattenBookMenu = (bookItem: BookLink) => {
    const item = {...bookItem}
    item.children = []
    flattenedMenu.push(item)
    if (bookItem.children) bookItem.children.map(child => flattenBookMenu(child))
  }
  node.book && flattenBookMenu(node.book)

  const nextPage = flattenedMenu[flattenedMenu.findIndex(page => page.url === node.path) + 1]
  const prevPage = flattenedMenu[flattenedMenu.findIndex(page => page.url === node.path) - 1]

  return (
    <article className="centered pt-32" {...props}>
      <div className="flex gap-5">
        <H1 className="flex-grow">{node.title}</H1>
        <div className="flex h-fit gap-5">
          {prevPage && (
            <Button href={prevPage.url} secondary className="flex items-center">
              <ChevronLeftIcon width={20} />
              Previous
            </Button>
          )}
          {nextPage && (
            <Button href={nextPage.url} secondary className="flex items-center">
              Next
              <ChevronRightIcon width={20} />
            </Button>
          )}
        </div>
      </div>
      <InteriorPage currentPath={node.path} menuItems={node.book ? [node.book] : undefined}>
        <div className="flex flex-col gap-20">
          {(node.suPolicyAuthority || node.suPolicyUpdated || node.suPolicyEffective) && (
            <div>
              {node.suPolicyUpdated && (
                <div>
                  <strong>Last Updated: </strong>
                  {new Date(node.suPolicyUpdated.time).toLocaleDateString("en-us", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: node.suPolicyUpdated.timezone,
                  })}
                </div>
              )}

              {node.suPolicyAuthority && (
                <div>
                  <strong>Authority: </strong>
                  {node.suPolicyAuthority}
                </div>
              )}

              {node.suPolicyEffective && (
                <div>
                  <strong>Effective Date: </strong>
                  {new Date(node.suPolicyEffective.time).toLocaleDateString("en-us", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: node.suPolicyEffective.timezone,
                  })}
                </div>
              )}
            </div>
          )}

          {changeLog.length > 0 && (
            <div className="mb-10 border border-black-40 bg-black-10 p-20">
              <H2 className="type-2">Change log:</H2>

              {changeLog.map(change => (
                <div key={change.id}>
                  <H3 className="type-0 flex gap-2">
                    <div>
                      {new Date(change.suPolicyDate.time).toLocaleDateString("en-us", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: change.suPolicyDate.timezone,
                      })}
                    </div>
                    <div className="w-[2px] shrink-0 bg-black" />
                    <div>{change.suPolicyTitle}</div>
                  </H3>

                  <div>
                    <StringWithLines text={change.suPolicyNotes} key={change.id} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <Wysiwyg html={node.body?.processed} />

          {node.book && <ChildPages currentPath={node.path} bookItems={[node.book]} />}
        </div>
      </InteriorPage>

      {node.suPolicyRelated && (
        <div>
          <H2 className="text-center">Related Policies</H2>
          <ul className="list-unstyled grid gap-20 lg:grid-cols-3">
            {node.suPolicyRelated.map(policy => (
              <li key={policy.id}>
                <Suspense fallback={<ImageCardSkeleton />}>
                  <RelatedPolicy path={policy.path} />
                </Suspense>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

const ChildPages = ({bookItems, currentPath}: {bookItems: Array<BookLink>; currentPath: string}) => {
  const getChildUrls = (item: BookLink): Array<BookLink> | undefined => {
    if (item.url === currentPath) return item.children
    let children
    for (let i = 0; i <= item.children.length; i++) {
      children = item.children[i] && getChildUrls(item.children[i])
      if (children) return children
    }
  }

  const childUrls = getChildUrls(bookItems[0])
  if (!childUrls) return
  return (
    <ol className="list-unstyled mt-20">
      {childUrls.map(child => (
        <ChildTeaser key={child.id} path={child.url} />
      ))}
    </ol>
  )
}

const ChildTeaser = async ({path}: {path: Maybe<string> | undefined}) => {
  if (!path) return
  const queryResponse = await getEntityFromPath<NodeStanfordPolicy>(path, false, true)
  if (!queryResponse.entity) return

  return (
    <li className="mb-16 border-b border-black-20 pb-16 last:border-b-0 [&_p]:mb-0">
      <StanfordPolicyListItem node={queryResponse.entity} />
    </li>
  )
}

const RelatedPolicy = async ({path}: {path: string}) => {
  const queryResponse = await getEntityFromPath<NodeStanfordPolicy>(path)
  if (!queryResponse.entity) return
  return <StanfordPolicyCard node={queryResponse.entity} headingLevel="h3" />
}

export default StanfordPolicyPage
