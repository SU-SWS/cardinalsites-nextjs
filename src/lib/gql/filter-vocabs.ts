// Can't put this in @types/drupal because it throws an error. Can't put this in gql-queries because "use cache"
// directive throws an error with non-async variables.
export enum FilterVocabs {
  Courses = "course_filters",
  Events = "event_filters",
  Media = "media_content_filters",
  News = "stanford_news_spotlight_filters",
  Opportunities = "opportunity_tag_filters",
  People = "person_filters",
  Publications = "publication_filters",
}
