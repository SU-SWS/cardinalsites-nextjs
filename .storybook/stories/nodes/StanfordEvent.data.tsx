import {NodeStanfordEvent} from "@lib/gql/__generated__/drupal";

export const StanfordEventData = () => {
  return {
    __typename: 'NodeStanfordEvent',
    id: '210be681-f305-4b99-a2a6-da7d7a1ac2e8',
    title: 'Introduction to Stanford Sites',
    status: true,
    path: '/events/stanford-sites-onboarding-sessions/5x/introduction-stanford-sites-1',
    changed: {
      timezone: 'America/Los_Angeles',
      time: '2024-02-01T14:45:54-08:00'
    },
    created: {
      timezone: 'America/Los_Angeles',
      time: '2024-01-05T16:50:58-08:00'
    },
    body: null,
    suEventAltLoc: null,
    suEventAudience: null,
    suEventComponents: null,
    suEventContactInfo: null,
    suEventCta: {
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSdzOKMwQ_Mo6XL9F7ytGI8LoUmeI2zHF6FccOYlnUfzVjSJjQ/viewform',
      title: 'Register'
    },
    suEventDateTime: {
      value: '1708110000',
      end_value: '1708113600',
      timezone: 'America/Los_Angeles',
      rrule_index: null,
      rrule: null
    },
    suEventDek: 'dek field Join our monthly onboarding session',
    suEventEmail: null,
    suEventGroups: null,
    suEventKeywords: null,
    suEventLocation: {
      langcode: null,
      country: {name: 'United States', code: 'US'},
      givenName: null,
      additionalName: null,
      familyName: null,
      organization: 'Green Ridge',
      addressLine1: '766 Green Ridge Park',
      addressLine2: null,
      postalCode: '99999',
      sortingCode: null,
      dependentLocality: null,
      locality: 'Washington',
      administrativeArea: 'DC'
    },
    suEventMapLink: null,
    suEventSchedule: null,
    suEventSource: {
      url: 'http://localhost',
      title: ''
    },
    suEventSponsor: null,
    suEventSubheadline: 'subheadline field',
    suEventSubject: null,
    suEventTelephone: null,
    suEventType: [
      {
        __typename: 'TermStanfordEventType',
        id: '2402818d-7056-4eec-a522-49e77def4cdc',
        name: '5.x',
        path: '/events/stanford-sites-onboarding-sessions/5x',
        weight: 0,
        parent: {id: '249d3aa0-686f-4533-b73e-493cd596aeee'}
      }
    ]
  } as unknown as NodeStanfordEvent;
}