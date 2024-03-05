import {NodeStanfordEventSeries} from "@lib/gql/__generated__/drupal";

export const StanfordEventSeriesData = () => {
  return {
    __typename: "NodeStanfordEventSeries",
    id: "0e179c3d-c9e3-4753-ba6a-140e8118fb53",
    title: "Test Event Series",
    status: true,
    path: "/event/series/test-event-series",
    changed: {timezone: "America/Los_Angeles", time: "2024-02-05T13:12:15-08:00"},
    created: {timezone: "America/Los_Angeles", time: "2024-02-05T13:12:11-08:00"},
    suEventSeriesDek: "Dek field",
    suEventSeriesEvent: [{
      __typename: "NodeStanfordEvent",
      id: "9f753f06-fd90-4e66-9a5f-e974a4a3a3d3",
      title: "Event with an image",
      status: false,
      path: "/events/event-image",
      changed: {timezone: "America/Los_Angeles", time: "2023-09-19T07:28:42-07:00"},
      created: {timezone: "America/Los_Angeles", time: "2023-02-03T15:22:15-08:00"},
      suEventAltLoc: null,
      suEventSubheadline: null,
      suEventDek: null,
      suEventLocation: null,
      suEventDateTime: {
        value: "1893484800",
        end_value: "1893571140",
        timezone: "America/Los_Angeles",
        rrule_index: null,
        rrule: null
      },
      suEventType: null,
      suEventSource: null
    }, {
      __typename: "NodeStanfordEvent",
      id: "0c36f4e9-804f-4f80-afaa-a9d6209f90ec",
      title: "Introduction to Stanford Sites",
      status: true,
      path: "/events/stanford-sites-onboarding-sessions/introduction-stanford-sites-1",
      changed: {timezone: "America/Los_Angeles", time: "2023-09-15T10:26:58-07:00"},
      created: {timezone: "America/Los_Angeles", time: "2023-09-09T15:21:39-07:00"},
      suEventAltLoc: null,
      suEventSubheadline: null,
      suEventDek: "Join our monthly onboarding session",
      suEventLocation: null,
      suEventDateTime: {
        value: "1694800800",
        end_value: "1694804400",
        timezone: "America/Los_Angeles",
        rrule_index: null,
        rrule: null
      },
      suEventType: [{
        __typename: "TermStanfordEventType",
        id: "249d3aa0-686f-4533-b73e-493cd596aeee",
        name: "Stanford Sites Onboarding Sessions",
        path: "/events/stanford-sites-onboarding-sessions",
        weight: 1,
        parent: null
      }],
      suEventSource: {
        url: "https://docs.google.com/forms/d/e/1FAIpQLSdzOKMwQ_Mo6XL9F7ytGI8LoUmeI2zHF6FccOYlnUfzVjSJjQ/viewform",
        title: ""
      }
    }],
    suEventSeriesSubheadline: "Subheadline",
    suEventSeriesType: [{
      __typename: "TermStanfordEventType",
      id: "7bf41b36-bd21-494b-aa1e-fbe7edb1bf00",
      name: "Exhibition",
      path: "/events/exhibition",
      weight: 0,
      parent: null
    }]
  } as unknown as NodeStanfordEventSeries;
}