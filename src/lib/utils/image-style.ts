import {ImageStyleDerivative} from "@lib/gql/__generated__/graphql"

/**
 * Read an aliased image style variation from an image field.
 *
 * Fragments request derivatives with an alias, e.g. `cardStyle: variations(styles: [LARGE_SQUARE])`. Aliases are not
 * part of the generated schema types, so components typed with schema types (`NodeStanfordPerson`, etc.) can't see
 * them.
 *
 * Derivative urls carry an `?itok=` token that Drupal needs to generate a style that doesn't exist yet, and
 * `images.remotePatterns` rejects any source with a query string. Render derivatives with `unoptimized` so they load
 * straight from Drupal instead of going through (and being billed by) the image optimizer.
 *
 * @param image - The image field object, e.g. `node.suPersonPhoto?.mediaImage`.
 * @param alias - The alias used for the `variations` field in the GraphQL fragment.
 */
export const getImageStyle = (image: object | null | undefined, alias: string): ImageStyleDerivative | undefined =>
  (image as Record<string, ImageStyleDerivative[] | undefined> | null | undefined)?.[alias]?.[0]
