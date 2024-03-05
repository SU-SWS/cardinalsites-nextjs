import {NodeStanfordNews} from "@lib/gql/__generated__/drupal";

export const StanfordNewsData = () => {
  return {
    __typename: "NodeStanfordNews",
    id: "f6113f95-effe-4b73-8f41-c5a8c42aa6c3",
    title: "Stanford Sites v5.1.0 Released – 12/7/2023",
    status: true,
    path: "/news/stanford-sites-v510-released-1272023",
    changed: {timezone: "America/Los_Angeles", time: "2023-12-08T08:00:00-08:00"},
    created: {timezone: "America/Los_Angeles", time: "2023-12-05T14:55:01-08:00"},
    suNewsBanner: null,
    suNewsBannerMediaCaption: null,
    suNewsByline: null
  } as unknown as NodeStanfordNews;
}