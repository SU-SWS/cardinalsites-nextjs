/**
 * Types that are not provided by Graphql integration.
 */
declare global {
  const Ed11y: object
}

export type Slug = {slug: string[]}

export type PageProps = {
  params: Promise<Slug>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}
