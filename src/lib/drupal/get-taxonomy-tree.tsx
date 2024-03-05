import {TermUnion} from "@lib/gql/__generated__/drupal.d";

export type TermTree<T extends TermUnion> = T & {
  below?: TermTree<T>[]
}

export const getTaxonomyTree = <T extends TermUnion, >(terms: T[]): TermTree<T>[] => {
  const {below} = buildTaxonomyTree<T>(terms);
  return below || terms;
}

export const buildTaxonomyTree = <T extends TermUnion, >(
  terms: T[],
  parent: T["id"] = ""
): { below?: T[] } => {

  if (!terms?.length) return {below: []}

  const children = terms.filter((term) => parent && term.parent?.id === parent)

  return children.length ? {
    below: children.map((link) => ({
      ...link,
      ...buildTaxonomyTree(terms, link.id),
    })),
  } : {}
}
