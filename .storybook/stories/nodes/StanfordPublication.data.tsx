import {NodeStanfordPublication} from "@lib/gql/__generated__/drupal";

export const StanfordPublicationData = () => {
  return {
    __typename: "NodeStanfordPublication",
    id: "66fcad17-6c9d-457e-b5fe-e5d8ed365c8e",
    title: "Journal Article Example Publication",
    status: true,
    path: "/publications/journal-article-example-publication",
    changed: {timezone: "America/Los_Angeles", time: "2023-07-21T10:33:31-07:00"},
    created: {timezone: "America/Los_Angeles", time: "2023-07-21T10:31:38-07:00"},
    suPublicationAuthorRef: [{
      __typename: "NodeStanfordPerson",
      id: "62957556-fb66-4fab-9e8d-eaab24c6cdf3",
      title: "Foo N Bar",
      status: true,
      path: "/people/foobar",
      changed: {timezone: "America/Los_Angeles", time: "2023-10-03T10:42:12-07:00"},
      created: {timezone: "America/Los_Angeles", time: "2023-07-21T09:38:01-07:00"},
      suPersonPhoto: {
        __typename: "MediaImage",
        id: "57291474-4abf-4387-ba0d-cdbca677a507",
        name: "Foo bar",
        mediaImage: {
          url: "https://placehold.co/2000x1000",
          alt: "Dena N DeBry",
          height: 522,
          width: 350
        }
      },
      suPersonFullTitle: "Systems Administrator III",
      suPersonShortTitle: "SysAdmin"
    }],
    suPublicationCta: null,
    suPublicationImage: null,
    suPublicationTopics: null
  } as unknown as NodeStanfordPublication;
}