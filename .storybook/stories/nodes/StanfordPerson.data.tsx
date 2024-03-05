import {NodeStanfordPerson} from "@lib/gql/__generated__/drupal";

export const StanfordPersonData = () => {
  return {
    __typename: "NodeStanfordPerson",
    id: "47a624fd-c3cf-4fb2-9aef-ed560f2ec052",
    title: "Marthena Rapp",
    status: true,
    path: "/people/shea-mckinney",
    changed: {timezone: "America/Los_Angeles", time: "2023-09-14T12:08:41-07:00"},
    created: {timezone: "America/Los_Angeles", time: "2023-07-21T09:38:23-07:00"},
    body: {processed: "Facilisis arcu sit vel tempus tincidunt congue sem lacus interdum fusce portaest mi proin suspendisse ex consectetur felis sollicitudin pellentesque suspendisse hendrerit ex sem arcu.\nVarius enim morbi metus felis euismod eros vivamus erat interdum ipsum ex cursus nisi erat aliquam eget aliquam eget orci quisque pellentesque maecenas elementum nisi."},
    suPersonAcademicAppt: null,
    suPersonAdminAppts: null,
    suPersonAffiliations: null,
    suPersonComponents: null,
    suPersonEducation: ["none, Test2, nothing  (2014)", "big deal, unicorns., Magic  (1244)"],
    suPersonEmail: "cpretty1@etsy.com",
    suPersonFax: null,
    suPersonFirstName: "Marthena",
    suPersonFullTitle: "Senior Sales Associate\n",
    suPersonLastName: "Rapp",
    suPersonLinks: [{url: "http://www.google.com/", title: "Google"}, {
      url: "https://drupal.org/",
      title: "Drupal Page"
    }, {url: "http://linkedin.com", title: "LinkedIn"}],
    suPersonLocationAddress: null,
    suPersonLocationName: null,
    suPersonMailCode: null,
    suPersonMapUrl: null,
    suPersonMobilePhone: null,
    suPersonPhoto: {
      __typename: "MediaImage",
      id: "ce220be2-89fc-4b49-8dc6-71089c152d5d",
      name: "Shea Ross McKinney",
      mediaImage: {
        url: "https://placehold.co/2000x1000",
        alt: "Person",
        height: 522,
        width: 350
      }
    },
    suPersonProfileLink: {url: "http://localhost", title: "View Full Profile"},
    suPersonPronouns: null,
    suPersonResearch: null,
    suPersonResearchInterests: null,
    suPersonScholarlyInterests: null,
    suPersonShortTitle: "Senior Sales Associate",
    suPersonTelephone: null,
    suPersonTypeGroup: [{
      __typename: "TermStanfordPersonType",
      id: "87a608ef-8bf5-46c9-b567-f74f36e1e7df",
      name: "Sales",
      path: "/people/sales",
      weight: 2,
      parent: {id: "50f0f22c-306e-4304-ba72-25cebba57b2b"}
    }]
  } as unknown as NodeStanfordPerson
}
