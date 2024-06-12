import {ParagraphBehaviors} from "@lib/drupal/drupal-jsonapi.d"
import {ParagraphInterface} from "@lib/gql/__generated__/drupal.d"

export const getParagraphBehaviors = <T extends ParagraphBehaviors>(paragraph: ParagraphInterface): T => {
  if (paragraph.behaviors) return JSON.parse(paragraph.behaviors)
  return {} as T
}
