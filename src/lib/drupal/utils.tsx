import {stringify} from "qs"
import {TermUnion} from "@lib/gql/__generated__/drupal.d"

export const buildUrl = (path: string, params?: string | Record<string, string> | URLSearchParams): URL => {
  const url = new URL(path.charAt(0) === "/" ? `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${path}` : path)

  // Use instead URLSearchParams for nested params.
  if (params) url.search = stringify(params)
  return url
}

export type PageProps = {
  params: {slug: string | string[]}
  searchParams?: Record<string, string | string[] | undefined>
}

export const getPathFromContext = (context: PageProps, prefix = ""): string => {
  let {slug} = context.params

  slug = Array.isArray(slug) ? slug.map(s => encodeURIComponent(s)).join("/") : slug
  slug = slug.replace(/^\//, "")
  return prefix ? `${prefix}/${slug}` : `/${slug}`
}

export type TermTree<T extends TermUnion> = T & {
  below?: TermTree<T>[]
}

export const getTaxonomyTree = <T extends TermUnion>(terms: T[]): TermTree<T>[] => {
  const {below} = buildTaxonomyTree<T>(terms)
  return below || terms
}

export const buildTaxonomyTree = <T extends TermUnion>(terms: T[], parent: T["id"] = ""): {below?: T[]} => {
  if (!terms?.length) return {below: []}

  const children = terms.filter(term => parent && term.parent?.id === parent)

  return children.length
    ? {
        below: children.map(link => ({
          ...link,
          ...buildTaxonomyTree(terms, link.id),
        })),
      }
    : {}
}
