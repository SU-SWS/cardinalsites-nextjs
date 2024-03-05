import {ParagraphBehaviors} from "@lib/drupal/drupal-jsonapi.d";
import {ParagraphInterface} from "@lib/gql/__generated__/drupal.d";

export const getParagraphBehaviors = (paragraph: ParagraphInterface): ParagraphBehaviors => {
  if (paragraph.behaviors) return JSON.parse(paragraph.behaviors)
  return {}
}