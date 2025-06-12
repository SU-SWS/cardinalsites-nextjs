/** THIS IS GENERATED FILE. DO NOT MODIFY IT DIRECTLY, RUN 'yarn graphql' INSTEAD. **/
import * as DrupalTypes from './drupal.d';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export const FragmentPageInfoFragmentDoc = gql`
    fragment FragmentPageInfo on ConnectionPageInfo {
  hasNextPage
  endCursor
}
    `;
export const AllNodeInterfaceFragmentDoc = gql`
    fragment AllNodeInterface on NodeInterface {
  uuid
  path
  changed {
    time
  }
}
    `;
export const FragmentNodePageInfoFragmentDoc = gql`
    fragment FragmentNodePageInfo on Connection {
  pageInfo {
    ...FragmentPageInfo
  }
  nodes {
    ...AllNodeInterface
  }
}
    ${FragmentPageInfoFragmentDoc}
${AllNodeInterfaceFragmentDoc}`;
export const FragmentNodeInterfaceFragmentDoc = gql`
    fragment FragmentNodeInterface on NodeInterface {
  __typename
  uuid
  title
  path
}
    `;
export const FragmentMetaTagFragmentDoc = gql`
    fragment FragmentMetaTag on MetaTagUnion {
  ... on MetaTagValue {
    __typename
    tag
    attributes {
      name
      content
    }
  }
  ... on MetaTagProperty {
    __typename
    tag
    attributes {
      property
      content
    }
  }
}
    `;
export const FragmentNodePageFragmentDoc = gql`
    fragment FragmentNodePage on NodeInterface {
  ...FragmentNodeInterface
  status
  metatag {
    ...FragmentMetaTag
  }
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentMetaTagFragmentDoc}`;
export const FragmentTextSummaryFragmentDoc = gql`
    fragment FragmentTextSummary on TextSummary {
  processed
  summary
}
    `;
export const FragmentTermInterfaceFragmentDoc = gql`
    fragment FragmentTermInterface on TermInterface {
  __typename
  uuid
  name
  path
  weight
  parent {
    ... on TermInterface {
      uuid
    }
  }
}
    `;
export const FragmentNodeStanfordCourseFragmentDoc = gql`
    fragment FragmentNodeStanfordCourse on NodeStanfordCourse {
  body {
    ...FragmentTextSummary
  }
  suCourseAcademicYear
  suCourseCode
  suCourseId
  suCourseInstructors
  suCourseLink {
    url
    title
  }
  suCourseQuarters {
    ...FragmentTermInterface
  }
  suCourseSectionUnits
  suCourseSubject {
    ...FragmentTermInterface
  }
  suCourseTags {
    ...FragmentTermInterface
  }
}
    ${FragmentTextSummaryFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentParagraphInterfaceFragmentDoc = gql`
    fragment FragmentParagraphInterface on ParagraphInterface {
  __typename
  uuid
  behaviors
  status
}
    `;
export const FragmentTextFragmentDoc = gql`
    fragment FragmentText on Text {
  processed
}
    `;
export const FragmentParagraphStanfordAccordionFragmentDoc = gql`
    fragment FragmentParagraphStanfordAccordion on ParagraphStanfordAccordion {
  suAccordionBody {
    ...FragmentText
  }
  suAccordionTitle
}
    ${FragmentTextFragmentDoc}`;
export const FragmentParagraphStanfordFaqFragmentDoc = gql`
    fragment FragmentParagraphStanfordFaq on ParagraphStanfordFaq {
  suFaqHeadline
  suFaqDescription {
    processed
  }
  suFaqQuestions {
    ...FragmentParagraphInterface
    ...FragmentParagraphStanfordAccordion
  }
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphStanfordAccordionFragmentDoc}`;
export const FragmentMediaInterfaceFragmentDoc = gql`
    fragment FragmentMediaInterface on MediaInterface {
  __typename
  uuid
  name
}
    `;
export const FragmentMediaImageFragmentDoc = gql`
    fragment FragmentMediaImage on MediaImage {
  ...FragmentMediaInterface
  mediaImage {
    url
    alt
    height
    width
  }
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordBannerFragmentDoc = gql`
    fragment FragmentParagraphStanfordBanner on ParagraphStanfordBanner {
  suBannerHeader
  suBannerBody {
    ...FragmentText
  }
  suBannerSupHeader
  suBannerButton {
    url
    title
  }
  suBannerImage {
    ...FragmentMediaImage
  }
}
    ${FragmentTextFragmentDoc}
${FragmentMediaImageFragmentDoc}`;
export const FragmentMediaEmbeddableFragmentDoc = gql`
    fragment FragmentMediaEmbeddable on MediaEmbeddable {
  ...FragmentMediaInterface
  mediaEmbeddableCode
  mediaEmbeddableOembed
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaFileFragmentDoc = gql`
    fragment FragmentMediaFile on MediaFile {
  ...FragmentMediaInterface
  mediaFile {
    url
  }
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaGoogleFormFragmentDoc = gql`
    fragment FragmentMediaGoogleForm on MediaGoogleForm {
  ...FragmentMediaInterface
  mediaGoogleForm
  mediaGoogleForm
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaStanfordGalleryImageFragmentDoc = gql`
    fragment FragmentMediaStanfordGalleryImage on MediaStanfordGalleryImage {
  ...FragmentMediaInterface
  suGalleryCaption
  suGalleryImage {
    url
    alt
    height
    width
  }
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaVideoFragmentDoc = gql`
    fragment FragmentMediaVideo on MediaVideo {
  ...FragmentMediaInterface
  mediaOembedVideo
}
    ${FragmentMediaInterfaceFragmentDoc}`;
export const FragmentMediaUnionFragmentDoc = gql`
    fragment FragmentMediaUnion on MediaUnion {
  ...FragmentMediaEmbeddable
  ...FragmentMediaFile
  ...FragmentMediaGoogleForm
  ...FragmentMediaImage
  ...FragmentMediaStanfordGalleryImage
  ...FragmentMediaVideo
}
    ${FragmentMediaEmbeddableFragmentDoc}
${FragmentMediaFileFragmentDoc}
${FragmentMediaGoogleFormFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentMediaStanfordGalleryImageFragmentDoc}
${FragmentMediaVideoFragmentDoc}`;
export const FragmentParagraphStanfordCardFragmentDoc = gql`
    fragment FragmentParagraphStanfordCard on ParagraphStanfordCard {
  suCardHeader
  suCardSuperHeader
  suCardBody {
    ...FragmentText
  }
  suCardLink {
    url
    title
  }
  suCardMedia {
    ...FragmentMediaUnion
  }
}
    ${FragmentTextFragmentDoc}
${FragmentMediaUnionFragmentDoc}`;
export const FragmentParagraphStanfordEntityFragmentDoc = gql`
    fragment FragmentParagraphStanfordEntity on ParagraphStanfordEntity {
  suEntityHeadline
  suEntityDescription {
    ...FragmentText
  }
  suEntityButton {
    url
    title
  }
  suEntityItem {
    ...FragmentNodeInterface
  }
}
    ${FragmentTextFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordGalleryFragmentDoc = gql`
    fragment FragmentParagraphStanfordGallery on ParagraphStanfordGallery {
  suGalleryHeadline
  suGalleryDescription {
    ...FragmentText
  }
  suGalleryButton {
    url
    title
  }
  suGalleryImages {
    ...FragmentMediaStanfordGalleryImage
  }
}
    ${FragmentTextFragmentDoc}
${FragmentMediaStanfordGalleryImageFragmentDoc}`;
export const FragmentParagraphStanfordListFragmentDoc = gql`
    fragment FragmentParagraphStanfordList on ParagraphStanfordList {
  suListHeadline
  suListDescription {
    ...FragmentText
  }
  suListButton {
    url
    title
  }
  suListView {
    view
    display
    contextualFilter
    pageSize
  }
}
    ${FragmentTextFragmentDoc}`;
export const FragmentParagraphStanfordFilteredListFragmentDoc = gql`
    fragment FragmentParagraphStanfordFilteredList on ParagraphStanfordFilteredList {
  suListHeadline
  suListDescription {
    ...FragmentText
  }
  suFilteredListView {
    view
    display
    contextualFilter
    pageSize
  }
}
    ${FragmentTextFragmentDoc}`;
export const FragmentParagraphStanfordMediaCaptionFragmentDoc = gql`
    fragment FragmentParagraphStanfordMediaCaption on ParagraphStanfordMediaCaption {
  suMediaCaptionMedia {
    ...FragmentMediaUnion
  }
  suMediaCaptionLink {
    url
    title
  }
  suMediaCaptionCaption {
    ...FragmentText
  }
}
    ${FragmentMediaUnionFragmentDoc}
${FragmentTextFragmentDoc}`;
export const FragmentParagraphStanfordSpacerFragmentDoc = gql`
    fragment FragmentParagraphStanfordSpacer on ParagraphStanfordSpacer {
  suSpacerSize
}
    `;
export const FragmentParagraphStanfordWysiwygFragmentDoc = gql`
    fragment FragmentParagraphStanfordWysiwyg on ParagraphStanfordWysiwyg {
  suWysiwygText {
    ...FragmentText
  }
}
    ${FragmentTextFragmentDoc}`;
export const FragmentParagraphStanfordLayoutFragmentDoc = gql`
    fragment FragmentParagraphStanfordLayout on ParagraphStanfordLayout {
  ...FragmentParagraphInterface
}
    ${FragmentParagraphInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordStatCardFragmentDoc = gql`
    fragment FragmentParagraphStanfordStatCard on ParagraphStanfordStatCard {
  suStatBgColor {
    color
  }
  suStatBody {
    processed
  }
  suStatButton {
    url
    title
  }
  suStatCentered
  suStatHeadline
  suStatHeadlineLvl
  suStatHeadingHide
  suStatIcon {
    iconName
    style
  }
  suStatIconColor {
    color
  }
  suStatImage {
    ...FragmentMediaImage
  }
  suStatLinkStyle
  suStatStat
  suStatStatColor {
    color
  }
  suStatSuperhead
}
    ${FragmentMediaImageFragmentDoc}`;
export const FragmentParagraphUnionFragmentDoc = gql`
    fragment FragmentParagraphUnion on ParagraphUnion {
  ...FragmentParagraphInterface
  ...FragmentParagraphStanfordAccordion
  ...FragmentParagraphStanfordFaq
  ...FragmentParagraphStanfordBanner
  ...FragmentParagraphStanfordCard
  ...FragmentParagraphStanfordEntity
  ...FragmentParagraphStanfordGallery
  ...FragmentParagraphStanfordList
  ...FragmentParagraphStanfordFilteredList
  ...FragmentParagraphStanfordMediaCaption
  ...FragmentParagraphStanfordSpacer
  ...FragmentParagraphStanfordWysiwyg
  ...FragmentParagraphStanfordLayout
  ...FragmentParagraphStanfordStatCard
}
    ${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphStanfordAccordionFragmentDoc}
${FragmentParagraphStanfordFaqFragmentDoc}
${FragmentParagraphStanfordBannerFragmentDoc}
${FragmentParagraphStanfordCardFragmentDoc}
${FragmentParagraphStanfordEntityFragmentDoc}
${FragmentParagraphStanfordGalleryFragmentDoc}
${FragmentParagraphStanfordListFragmentDoc}
${FragmentParagraphStanfordFilteredListFragmentDoc}
${FragmentParagraphStanfordMediaCaptionFragmentDoc}
${FragmentParagraphStanfordSpacerFragmentDoc}
${FragmentParagraphStanfordWysiwygFragmentDoc}
${FragmentParagraphStanfordLayoutFragmentDoc}
${FragmentParagraphStanfordStatCardFragmentDoc}`;
export const FragmentSmartDateTypeFragmentDoc = gql`
    fragment FragmentSmartDateType on SmartDateType {
  value
  end_value
  timezone
  rrule_index
  rrule
}
    `;
export const FragmentAddressTypeFragmentDoc = gql`
    fragment FragmentAddressType on Address {
  langcode
  country {
    name
    code
  }
  givenName
  additionalName
  familyName
  organization
  addressLine1
  addressLine2
  postalCode
  sortingCode
  dependentLocality
  locality
  administrativeArea
}
    `;
export const FragmentParagraphStanfordPersonCtumFragmentDoc = gql`
    fragment FragmentParagraphStanfordPersonCtum on ParagraphStanfordPersonCtum {
  suPersonCtaName
  suPersonCtaTitle
  suPersonCtaLink {
    url
    title
  }
  suPersonCtaImage {
    ...FragmentMediaImage
  }
}
    ${FragmentMediaImageFragmentDoc}`;
export const FragmentParagraphStanfordScheduleFragmentDoc = gql`
    fragment FragmentParagraphStanfordSchedule on ParagraphStanfordSchedule {
  suScheduleHeadline
  suScheduleDescription {
    ...FragmentText
  }
  suScheduleDateTime {
    ...FragmentSmartDateType
  }
  suScheduleLocation {
    ...FragmentAddressType
  }
  suScheduleUrl {
    url
    title
  }
  suScheduleSpeaker {
    ...FragmentParagraphInterface
    ...FragmentParagraphStanfordPersonCtum
  }
}
    ${FragmentTextFragmentDoc}
${FragmentSmartDateTypeFragmentDoc}
${FragmentAddressTypeFragmentDoc}
${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphStanfordPersonCtumFragmentDoc}`;
export const FragmentNodeStanfordEventFragmentDoc = gql`
    fragment FragmentNodeStanfordEvent on NodeStanfordEvent {
  body {
    ...FragmentTextSummary
  }
  suEventAltLoc
  suEventAudience {
    ...FragmentTermInterface
  }
  suEventComponents {
    ...FragmentParagraphUnion
  }
  suEventContactInfo
  suEventCta {
    url
    title
  }
  suEventDateTime {
    ...FragmentSmartDateType
  }
  suEventDek
  suEventEmail
  suEventGroups {
    ...FragmentTermInterface
  }
  suEventKeywords {
    ...FragmentTermInterface
  }
  suEventLocation {
    ...FragmentAddressType
  }
  suEventMapLink {
    url
    title
  }
  suEventSchedule {
    ...FragmentParagraphInterface
    ...FragmentParagraphStanfordSchedule
  }
  suEventSource {
    url
    title
  }
  suEventSponsor
  suEventSubheadline
  suEventSubject {
    ...FragmentTermInterface
  }
  suEventTelephone
  suEventType {
    ...FragmentTermInterface
  }
}
    ${FragmentTextSummaryFragmentDoc}
${FragmentTermInterfaceFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentSmartDateTypeFragmentDoc}
${FragmentAddressTypeFragmentDoc}
${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphStanfordScheduleFragmentDoc}`;
export const FragmentNodeStanfordEventTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordEventTeaser on NodeStanfordEvent {
  suEventAltLoc
  suEventSubheadline
  suEventDek
  suEventAltLoc
  suEventLocation {
    ...FragmentAddressType
  }
  suEventDateTime {
    ...FragmentSmartDateType
  }
  suEventType {
    ...FragmentTermInterface
  }
  suEventSource {
    url
    title
  }
}
    ${FragmentAddressTypeFragmentDoc}
${FragmentSmartDateTypeFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeStanfordEventSeriesFragmentDoc = gql`
    fragment FragmentNodeStanfordEventSeries on NodeStanfordEventSeries {
  suEventSeriesComponents {
    ...FragmentParagraphUnion
  }
  suEventSeriesDek
  suEventSeriesEvent {
    ...FragmentNodeStanfordEventTeaser
  }
  suEventSeriesSubheadline
  suEventSeriesType {
    ...FragmentTermInterface
  }
}
    ${FragmentParagraphUnionFragmentDoc}
${FragmentNodeStanfordEventTeaserFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentDateTimeFragmentDoc = gql`
    fragment FragmentDateTime on DateTime {
  timezone
  time
}
    `;
export const FragmentNodeStanfordNewsFragmentDoc = gql`
    fragment FragmentNodeStanfordNews on NodeStanfordNews {
  suNewsBanner {
    ...FragmentMediaUnion
  }
  suNewsBannerMediaCaption
  suNewsByline
  suNewsComponents {
    ...FragmentParagraphUnion
  }
  suNewsDek
  suNewsFeaturedMedia {
    ...FragmentMediaUnion
  }
  suNewsHideSocial
  suNewsPublishingDate {
    ...FragmentDateTime
  }
  suNewsSource {
    url
    title
  }
  suNewsTopics {
    ...FragmentTermInterface
  }
}
    ${FragmentMediaUnionFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentDateTimeFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentParagraphStanfordPageTitleBannerFragmentDoc = gql`
    fragment FragmentParagraphStanfordPageTitleBanner on ParagraphStanfordPageTitleBanner {
  suTitleBannerImage {
    ...FragmentMediaImage
  }
}
    ${FragmentMediaImageFragmentDoc}`;
export const FragmentNodeStanfordPageFragmentDoc = gql`
    fragment FragmentNodeStanfordPage on NodeStanfordPage {
  layoutSelection {
    id
  }
  suBasicPageType {
    ...FragmentTermInterface
  }
  suPageBanner {
    ...FragmentParagraphInterface
    ...FragmentParagraphStanfordBanner
    ...FragmentParagraphStanfordPageTitleBanner
  }
  suPageComponents {
    ...FragmentParagraphUnion
  }
  suPageDescription
  suPageImage {
    ...FragmentMediaUnion
  }
}
    ${FragmentTermInterfaceFragmentDoc}
${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphStanfordBannerFragmentDoc}
${FragmentParagraphStanfordPageTitleBannerFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentMediaUnionFragmentDoc}`;
export const FragmentNodeStanfordPersonFragmentDoc = gql`
    fragment FragmentNodeStanfordPerson on NodeStanfordPerson {
  body {
    ...FragmentTextSummary
  }
  suPersonAcademicAppt
  suPersonAdminAppts
  suPersonAffiliations {
    url
    title
  }
  suPersonComponents {
    ...FragmentParagraphUnion
  }
  suPersonEducation
  suPersonEmail
  suPersonFax
  suPersonFirstName
  suPersonFullTitle
  suPersonLastName
  suPersonLinks {
    url
    title
  }
  suPersonLocationAddress {
    ...FragmentText
  }
  suPersonLocationName
  suPersonMailCode
  suPersonMapUrl {
    url
    title
  }
  suPersonMobilePhone
  suPersonPhoto {
    ...FragmentMediaImage
  }
  suPersonProfileLink {
    url
    title
  }
  suPersonPronouns
  suPersonResearch {
    ...FragmentText
  }
  suPersonResearchInterests
  suPersonScholarlyInterests {
    ...FragmentText
  }
  suPersonShortTitle
  suPersonTelephone
  suPersonTypeGroup {
    ...FragmentTermInterface
  }
}
    ${FragmentTextSummaryFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentTextFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentSuPolicyLogFragmentDoc = gql`
    fragment FragmentSuPolicyLog on SuPolicyLog {
  __typename
  uuid
  suPolicyDate {
    ...FragmentDateTime
  }
  suPolicyNotes
  suPolicyPublic
  suPolicyTitle
}
    ${FragmentDateTimeFragmentDoc}`;
export const FragmentNodeStanfordPolicyFragmentDoc = gql`
    fragment FragmentNodeStanfordPolicy on NodeStanfordPolicy {
  body {
    ...FragmentTextSummary
  }
  suPolicyAuthority
  suPolicyAutoPrefix
  suPolicyChangelog {
    ...FragmentSuPolicyLog
  }
  suPolicyChapter
  suPolicyEffective {
    ...FragmentDateTime
  }
  suPolicyPolicyNum
  suPolicyRelated {
    ... on NodeInterface {
      uuid
      path
    }
  }
  suPolicySubchapter
  suPolicyTitle
  suPolicyUpdated {
    ...FragmentDateTime
  }
  book {
    id
    title
    url
    expanded
    children {
      id
      title
      url
      expanded
      children {
        id
        title
        url
        expanded
        children {
          id
          title
          url
          expanded
          children {
            id
            title
            url
            expanded
            children {
              id
              title
              url
              expanded
            }
          }
        }
      }
    }
  }
}
    ${FragmentTextSummaryFragmentDoc}
${FragmentSuPolicyLogFragmentDoc}
${FragmentDateTimeFragmentDoc}`;
export const FragmentNodeStanfordPersonTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordPersonTeaser on NodeStanfordPerson {
  suPersonPhoto {
    ...FragmentMediaImage
  }
  suPersonFullTitle
  suPersonShortTitle
}
    ${FragmentMediaImageFragmentDoc}`;
export const FragmentLinkFragmentDoc = gql`
    fragment FragmentLink on Link {
  url
  title
}
    `;
export const FragmentNodeStanfordPublicationFragmentDoc = gql`
    fragment FragmentNodeStanfordPublication on NodeStanfordPublication {
  suPublicationAuthorRef {
    ...FragmentNodeStanfordPersonTeaser
  }
  suPublicationComponents {
    ...FragmentParagraphUnion
  }
  suPublicationCta {
    ...FragmentLink
  }
  suPublicationImage {
    ...FragmentMediaImage
  }
  suPublicationTopics {
    ...FragmentTermInterface
  }
}
    ${FragmentNodeStanfordPersonTeaserFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentLinkFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeStanfordOpportunityFragmentDoc = gql`
    fragment FragmentNodeStanfordOpportunity on NodeStanfordOpportunity {
  body {
    ...FragmentTextSummary
  }
  suOppApplicationDeadline {
    ...FragmentDateTime
  }
  suOppCardFooter {
    ...FragmentText
  }
  suOppComponents {
    ...FragmentParagraphUnion
  }
  suOppContactEmail
  suOppContactName
  suOppContactPhone
  suOppContactUrl {
    ...FragmentLink
  }
  suOppCourseCode
  suOppCtaUrl {
    ...FragmentLink
  }
  suOppEligibility {
    ...FragmentText
  }
  suOppIcon {
    iconName
    style
  }
  suOppImage {
    ...FragmentMediaImage
  }
  suOppLearnMore {
    ...FragmentLink
  }
  suOppOpenDate {
    ...FragmentDateTime
  }
  suOppPrerequisites {
    ...FragmentText
  }
  suOppSource {
    ...FragmentLink
  }
  suOppSponsor {
    ...FragmentTermInterface
  }
  suOppStartDate {
    ...FragmentDateTime
  }
  suOppStatus
  suOppSummary {
    ...FragmentText
  }
  suOppTags {
    ...FragmentTermInterface
  }
  suOppType {
    ...FragmentTermInterface
  }
  suOppUnits {
    ...FragmentTermInterface
  }
}
    ${FragmentTextSummaryFragmentDoc}
${FragmentDateTimeFragmentDoc}
${FragmentTextFragmentDoc}
${FragmentParagraphUnionFragmentDoc}
${FragmentLinkFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeUnionFragmentDoc = gql`
    fragment FragmentNodeUnion on NodeUnion {
  ...FragmentNodePage
  ...FragmentNodeStanfordCourse
  ...FragmentNodeStanfordEvent
  ...FragmentNodeStanfordEventSeries
  ...FragmentNodeStanfordNews
  ...FragmentNodeStanfordPage
  ...FragmentNodeStanfordPerson
  ...FragmentNodeStanfordPolicy
  ...FragmentNodeStanfordPublication
  ...FragmentNodeStanfordOpportunity
}
    ${FragmentNodePageFragmentDoc}
${FragmentNodeStanfordCourseFragmentDoc}
${FragmentNodeStanfordEventFragmentDoc}
${FragmentNodeStanfordEventSeriesFragmentDoc}
${FragmentNodeStanfordNewsFragmentDoc}
${FragmentNodeStanfordPageFragmentDoc}
${FragmentNodeStanfordPersonFragmentDoc}
${FragmentNodeStanfordPolicyFragmentDoc}
${FragmentNodeStanfordPublicationFragmentDoc}
${FragmentNodeStanfordOpportunityFragmentDoc}`;
export const FragmentNodeStanfordCourseTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordCourseTeaser on NodeStanfordCourse {
  suCourseSubject {
    ...FragmentTermInterface
  }
  suCourseAcademicYear
  suCourseCode
  suCourseQuarters {
    ...FragmentTermInterface
  }
  suCourseInstructors
  body {
    processed
  }
}
    ${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeStanfordEventSeriesTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordEventSeriesTeaser on NodeStanfordEventSeries {
  suEventSeriesDek
}
    `;
export const FragmentNodeStanfordNewsTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordNewsTeaser on NodeStanfordNews {
  suNewsDek
  suNewsFeaturedMedia {
    ...FragmentMediaImage
  }
  suNewsTopics {
    ...FragmentTermInterface
  }
  suNewsPublishingDate {
    ...FragmentDateTime
  }
  suNewsSource {
    url
  }
}
    ${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}
${FragmentDateTimeFragmentDoc}`;
export const FragmentNodeStanfordPageTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordPageTeaser on NodeStanfordPage {
  suPageDescription
  suPageImage {
    ...FragmentMediaImage
  }
  suPageBanner {
    ...FragmentParagraphInterface
    ... on ParagraphStanfordBanner {
      suBannerImage {
        ...FragmentMediaImage
      }
    }
    ...FragmentParagraphStanfordPageTitleBanner
  }
}
    ${FragmentMediaImageFragmentDoc}
${FragmentParagraphInterfaceFragmentDoc}
${FragmentParagraphStanfordPageTitleBannerFragmentDoc}`;
export const FragmentNodeStanfordPolicyTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordPolicyTeaser on NodeStanfordPolicy {
  body {
    ...FragmentTextSummary
  }
  suPolicyUpdated {
    ...FragmentDateTime
  }
}
    ${FragmentTextSummaryFragmentDoc}
${FragmentDateTimeFragmentDoc}`;
export const FragmentNodeStanfordPublicationTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordPublicationTeaser on NodeStanfordPublication {
  suPublicationTopics {
    ...FragmentTermInterface
  }
  suPublicationCitation {
    ... on CitationInterface {
      uuid
      title
      ... on CitationSuArticleNewspaper {
        apa
        chicago
      }
      ... on CitationSuBook {
        apa
        chicago
      }
      ... on CitationSuArticleJournal {
        apa
        chicago
      }
      ... on CitationSuOther {
        apa
        chicago
      }
      ... on CitationSuThesi {
        apa
        chicago
      }
    }
  }
}
    ${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeStanfordOpportunityTeaserFragmentDoc = gql`
    fragment FragmentNodeStanfordOpportunityTeaser on NodeStanfordOpportunity {
  suOppCardFooter {
    ...FragmentText
  }
  suOppIcon {
    iconName
    style
  }
  suOppImage {
    ...FragmentMediaImage
  }
  suOppSummary {
    ...FragmentText
  }
  suOppSource {
    url
  }
  suOppSponsor {
    ...FragmentTermInterface
  }
  suOppType {
    ...FragmentTermInterface
  }
}
    ${FragmentTextFragmentDoc}
${FragmentMediaImageFragmentDoc}
${FragmentTermInterfaceFragmentDoc}`;
export const FragmentNodeTeaserUnionFragmentDoc = gql`
    fragment FragmentNodeTeaserUnion on NodeUnion {
  ...FragmentNodeInterface
  ...FragmentNodeStanfordCourseTeaser
  ...FragmentNodeStanfordEventTeaser
  ...FragmentNodeStanfordEventSeriesTeaser
  ...FragmentNodeStanfordNewsTeaser
  ...FragmentNodeStanfordPageTeaser
  ...FragmentNodeStanfordPersonTeaser
  ...FragmentNodeStanfordPolicyTeaser
  ...FragmentNodeStanfordPublicationTeaser
  ...FragmentNodeStanfordOpportunityTeaser
}
    ${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordCourseTeaserFragmentDoc}
${FragmentNodeStanfordEventTeaserFragmentDoc}
${FragmentNodeStanfordEventSeriesTeaserFragmentDoc}
${FragmentNodeStanfordNewsTeaserFragmentDoc}
${FragmentNodeStanfordPageTeaserFragmentDoc}
${FragmentNodeStanfordPersonTeaserFragmentDoc}
${FragmentNodeStanfordPolicyTeaserFragmentDoc}
${FragmentNodeStanfordPublicationTeaserFragmentDoc}
${FragmentNodeStanfordOpportunityTeaserFragmentDoc}`;
export const FragmentMenuLinkFragmentDoc = gql`
    fragment FragmentMenuLink on MenuItem {
  url
  title
  id
  expanded
}
    `;
export const FragmentViewPageInfoFragmentDoc = gql`
    fragment FragmentViewPageInfo on ViewPageInfo {
  page
  total
}
    `;
export const FragmentViewFragmentDoc = gql`
    fragment FragmentView on View {
  pageInfo {
    ...FragmentViewPageInfo
  }
}
    ${FragmentViewPageInfoFragmentDoc}`;
export const NodeDocument = gql`
    query Node($uuid: ID!) {
  node(id: $uuid) {
    ...FragmentNodeUnion
  }
}
    ${FragmentNodeUnionFragmentDoc}`;
export const AllNodesDocument = gql`
    query AllNodes($first: Int = 1000, $nodeStanfordCourses: Cursor, $nodeStanfordEventSeriesItems: Cursor, $nodeStanfordEvents: Cursor, $nodeStanfordNewsItems: Cursor, $nodeStanfordPages: Cursor, $nodeStanfordPeople: Cursor, $nodeStanfordPolicies: Cursor, $nodeStanfordPublications: Cursor) {
  nodeStanfordPages(first: $first, after: $nodeStanfordPages, sortKey: CREATED_AT) {
    ...FragmentNodePageInfo
  }
  nodeStanfordCourses(
    first: $first
    after: $nodeStanfordCourses
    sortKey: CREATED_AT
  ) {
    ...FragmentNodePageInfo
  }
  nodeStanfordEventSeriesItems(
    first: $first
    after: $nodeStanfordEventSeriesItems
    sortKey: CREATED_AT
  ) {
    ...FragmentNodePageInfo
  }
  nodeStanfordEvents(
    first: $first
    after: $nodeStanfordEvents
    sortKey: CREATED_AT
  ) {
    ...FragmentNodePageInfo
  }
  nodeStanfordNewsItems(
    first: $first
    after: $nodeStanfordNewsItems
    sortKey: CREATED_AT
  ) {
    ...FragmentNodePageInfo
  }
  nodeStanfordPeople(
    first: $first
    after: $nodeStanfordPeople
    sortKey: CREATED_AT
  ) {
    ...FragmentNodePageInfo
  }
  nodeStanfordPolicies(
    first: $first
    after: $nodeStanfordPolicies
    sortKey: CREATED_AT
  ) {
    ...FragmentNodePageInfo
  }
  nodeStanfordPublications(
    first: $first
    after: $nodeStanfordPublications
    sortKey: CREATED_AT
  ) {
    ...FragmentNodePageInfo
  }
}
    ${FragmentNodePageInfoFragmentDoc}`;
export const CoursesDocument = gql`
    query Courses($first: Int = 1000, $after: Cursor) {
  nodeStanfordCourses(first: $first, after: $after, sortKey: CREATED_AT) {
    ...FragmentNodePageInfo
    nodes {
      ...FragmentNodeStanfordCourse
    }
  }
}
    ${FragmentNodePageInfoFragmentDoc}
${FragmentNodeStanfordCourseFragmentDoc}`;
export const EventSeriesDocument = gql`
    query EventSeries($first: Int = 1000, $after: Cursor) {
  nodeStanfordEventSeriesItems(first: $first, after: $after, sortKey: CREATED_AT) {
    ...FragmentNodePageInfo
    nodes {
      ...FragmentNodeStanfordEventSeries
    }
  }
}
    ${FragmentNodePageInfoFragmentDoc}
${FragmentNodeStanfordEventSeriesFragmentDoc}`;
export const EventsDocument = gql`
    query Events($first: Int = 1000, $after: Cursor) {
  nodeStanfordEvents(first: $first, after: $after, sortKey: CREATED_AT) {
    ...FragmentNodePageInfo
    nodes {
      ...FragmentNodeStanfordEvent
    }
  }
}
    ${FragmentNodePageInfoFragmentDoc}
${FragmentNodeStanfordEventFragmentDoc}`;
export const NewsDocument = gql`
    query News($first: Int = 1000, $after: Cursor) {
  nodeStanfordNewsItems(first: $first, after: $after, sortKey: CREATED_AT) {
    ...FragmentNodePageInfo
    nodes {
      ...FragmentNodeStanfordNews
    }
  }
}
    ${FragmentNodePageInfoFragmentDoc}
${FragmentNodeStanfordNewsFragmentDoc}`;
export const BasicPagesDocument = gql`
    query BasicPages($first: Int = 1000, $after: Cursor) {
  nodeStanfordPages(first: $first, after: $after, sortKey: CREATED_AT) {
    ...FragmentNodePageInfo
    nodes {
      ...FragmentNodeStanfordPage
    }
  }
}
    ${FragmentNodePageInfoFragmentDoc}
${FragmentNodeStanfordPageFragmentDoc}`;
export const PeopleDocument = gql`
    query People($first: Int = 1000, $after: Cursor) {
  nodeStanfordPeople(first: $first, after: $after, sortKey: CREATED_AT) {
    ...FragmentNodePageInfo
    nodes {
      ...FragmentNodeStanfordPerson
    }
  }
}
    ${FragmentNodePageInfoFragmentDoc}
${FragmentNodeStanfordPersonFragmentDoc}`;
export const PoliciesDocument = gql`
    query Policies($first: Int = 1000, $after: Cursor) {
  nodeStanfordPolicies(first: $first, after: $after, sortKey: CREATED_AT) {
    ...FragmentNodePageInfo
    nodes {
      ...FragmentNodeStanfordPolicy
    }
  }
}
    ${FragmentNodePageInfoFragmentDoc}
${FragmentNodeStanfordPolicyFragmentDoc}`;
export const PublicationsDocument = gql`
    query Publications($first: Int = 1000, $after: Cursor) {
  nodeStanfordPublications(first: $first, after: $after, sortKey: CREATED_AT) {
    ...FragmentNodePageInfo
    nodes {
      ...FragmentNodeStanfordPublication
    }
  }
}
    ${FragmentNodePageInfoFragmentDoc}
${FragmentNodeStanfordPublicationFragmentDoc}`;
export const MediaDocument = gql`
    query Media($uuid: ID!) {
  media(id: $uuid) {
    ...FragmentMediaUnion
  }
}
    ${FragmentMediaUnionFragmentDoc}`;
export const TermDocument = gql`
    query Term($uuid: ID!) {
  term(id: $uuid) {
    ...FragmentTermInterface
  }
}
    ${FragmentTermInterfaceFragmentDoc}`;
export const OpportunityFiltersTermsDocument = gql`
    query OpportunityFiltersTerms {
  termOpportunityTagFilters(first: 1000) {
    nodes {
      ...FragmentTermInterface
      ... on TermInterface {
        id
        weight
      }
    }
  }
}
    ${FragmentTermInterfaceFragmentDoc}`;
export const ParagraphDocument = gql`
    query Paragraph($uuid: ID!) {
  paragraph(id: $uuid) {
    ...FragmentParagraphUnion
  }
}
    ${FragmentParagraphUnionFragmentDoc}`;
export const ConfigPagesDocument = gql`
    query ConfigPages {
  stanfordBasicSiteSettings(first: 1) {
    nodes {
      __typename
      uuid
      suGoogleAnalytics
      suSiteAlgolia
      suSiteAlgoliaId
      suSiteAlgoliaIndex
      suSiteAlgoliaSearch
      suSiteAlgoliaUi
      suSiteDropdowns
      suSiteMenuLevels
      suSiteName
      suSiteNobots
      suSiteHeaderButton {
        title
        url
      }
      suSiteHeaderLinks {
        title
        url
      }
    }
  }
  stanfordGlobalMessages(first: 1) {
    nodes {
      __typename
      uuid
      suGlobalMsgEnabled
      suGlobalMsgHeader
      suGlobalMsgLabel
      suGlobalMsgLink {
        title
        url
      }
      suGlobalMsgMessage {
        processed
      }
      suGlobalMsgType
    }
  }
  stanfordLocalFooters(first: 1) {
    nodes {
      __typename
      uuid
      suFooterEnabled
      suLocalFootAction {
        title
        url
      }
      suLocalFootAddress {
        additionalName
        addressLine1
        addressLine2
        administrativeArea
        country {
          code
          name
        }
        dependentLocality
        familyName
        givenName
        langcode
        locality
        organization
        postalCode
        sortingCode
      }
      suLocalFootFButton
      suLocalFootFIntro {
        processed
      }
      suLocalFootFMethod
      suLocalFootFUrl {
        url
        title
      }
      suLocalFootLine1
      suLocalFootLine4
      suLocalFootLine2
      suLocalFootLine3
      suLocalFootLine5
      suLocalFootLocImg {
        alt
        height
        url
        width
      }
      suLocalFootLocLink {
        title
        url
      }
      suLocalFootLocOp
      suLocalFootPrCo {
        processed
      }
      suLocalFootPrimary {
        title
        url
      }
      suLocalFootPrimeH
      suLocalFootSeCo {
        processed
      }
      suLocalFootSecond {
        title
        url
      }
      suLocalFootSecondH
      suLocalFootSocial {
        title
        url
      }
      suLocalFootSunetT
      suLocalFootTr2Co {
        processed
      }
      suLocalFootTrCo {
        processed
      }
      suLocalFootUseLoc
      suLocalFootUseLogo
    }
  }
  stanfordSuperFooters(first: 1) {
    nodes {
      __typename
      uuid
      suSuperFootEnabled
      suSuperFootIntranet {
        title
        url
      }
      suSuperFootLink {
        title
        url
      }
      suSuperFootText {
        processed
      }
      suSuperFootTitle
    }
  }
  lockupSettings(first: 1) {
    nodes {
      __typename
      uuid
      suLine1
      suLine2
      suLine3
      suLine4
      suLine5
      suLockupEnabled
      suLockupOptions
      suUploadLogoImage {
        alt
        height
        url
        width
      }
      suUseThemeLogo
    }
  }
}
    `;
export const MenuDocument = gql`
    query Menu($name: MenuAvailable = MAIN) {
  menu(name: $name) {
    items {
      ...FragmentMenuLink
      children {
        ...FragmentMenuLink
        children {
          ...FragmentMenuLink
          children {
            ...FragmentMenuLink
            children {
              ...FragmentMenuLink
            }
          }
        }
      }
    }
  }
}
    ${FragmentMenuLinkFragmentDoc}`;
export const RouteDocument = gql`
    query Route($path: String!, $teaser: Boolean = false) {
  route(path: $path) {
    __typename
    ... on RouteRedirect {
      url
      internal
      status
      redirect
    }
    ... on RouteInternal {
      entity {
        ...FragmentNodeUnion @skip(if: $teaser)
        ...FragmentNodeTeaserUnion @include(if: $teaser)
      }
    }
  }
}
    ${FragmentNodeUnionFragmentDoc}
${FragmentNodeTeaserUnionFragmentDoc}`;
export const RedirectsDocument = gql`
    query Redirects($first: Int = 1000, $after: Cursor) {
  redirects(first: $first, after: $after) {
    redirects: nodes {
      uuid
      redirectSource {
        url
      }
      redirectRedirect {
        url
      }
      statusCode
    }
    pageInfo {
      endCursor
    }
  }
}
    `;
export const StanfordBasicPagesDocument = gql`
    query stanfordBasicPages($contextualFilters: StanfordBasicPagesContextualFilterInput, $sortKey: StanfordBasicPagesSortKeys, $sortDir: SortDirection, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordBasicPages(
    contextualFilter: $contextualFilters
    pageSize: $pageSize
    page: $page
    offset: $offset
    sortKey: $sortKey
    sortDir: $sortDir
  ) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeStanfordPageTeaser
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordPageTeaserFragmentDoc}`;
export const StanfordCoursesDocument = gql`
    query stanfordCourses($contextualFilters: StanfordCoursesContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordCourses(
    contextualFilter: $contextualFilters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeStanfordCourse
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordCourseFragmentDoc}`;
export const StanfordEventsDocument = gql`
    query stanfordEvents($contextualFilters: StanfordEventsContextualFilterInput, $pageSize: Int, $page: Int = -1, $offset: Int) {
  stanfordEvents(
    contextualFilter: $contextualFilters
    pageSize: $pageSize
    page: $page
    offset: $offset
    sortKey: START_TIME
  ) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeStanfordEventTeaser
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordEventTeaserFragmentDoc}`;
export const StanfordEventsPastEventsDocument = gql`
    query stanfordEventsPastEvents($contextualFilters: StanfordEventsPastEventsContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordEventsPastEvents(
    contextualFilter: $contextualFilters
    pageSize: $pageSize
    page: $page
    offset: $offset
    sortKey: START_TIME
  ) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeStanfordEventTeaser
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordEventTeaserFragmentDoc}`;
export const StanfordNewsDocument = gql`
    query stanfordNews($contextualFilters: StanfordNewsContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordNews(
    contextualFilter: $contextualFilters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeStanfordNewsTeaser
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordNewsTeaserFragmentDoc}`;
export const StanfordOpportunitiesDocument = gql`
    query stanfordOpportunities($contextualFilters: StanfordOpportunitiesContextualFilterInput, $filter: StanfordOpportunitiesFilterInput, $sortKey: StanfordOpportunitiesSortKeys, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordOpportunities(
    contextualFilter: $contextualFilters
    filter: $filter
    pageSize: $pageSize
    page: $page
    offset: $offset
    sortKey: $sortKey
  ) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeStanfordOpportunityTeaser
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordOpportunityTeaserFragmentDoc}`;
export const StanfordPersonDocument = gql`
    query stanfordPerson($contextualFilters: StanfordPersonContextualFilterInput, $pageSize: Int, $page: Int = -1, $offset: Int) {
  stanfordPerson(
    contextualFilter: $contextualFilters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeStanfordPersonTeaser
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordPersonTeaserFragmentDoc}`;
export const StanfordPublicationsDocument = gql`
    query stanfordPublications($contextualFilters: StanfordPublicationsContextualFilterInput, $pageSize: Int = -1, $page: Int, $offset: Int) {
  stanfordPublications(
    contextualFilter: $contextualFilters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeStanfordPublicationTeaser
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeStanfordPublicationTeaserFragmentDoc}`;
export const StanfordSharedTagsDocument = gql`
    query stanfordSharedTags($contextualFilters: StanfordSharedTagsContextualFilterInput, $pageSize: Int = 3, $page: Int, $offset: Int) {
  stanfordSharedTags(
    contextualFilter: $contextualFilters
    pageSize: $pageSize
    page: $page
    offset: $offset
  ) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeTeaserUnion
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeTeaserUnionFragmentDoc}`;
export const SearchDocument = gql`
    query search($filter: SearchFilterInput = {key: ""}, $pageSize: Int = 3, $page: Int, $offset: Int) {
  search(filter: $filter, pageSize: $pageSize, page: $page, offset: $offset) {
    ...FragmentView
    results {
      ...FragmentNodeInterface
      ...FragmentNodeTeaserUnion
    }
  }
}
    ${FragmentViewFragmentDoc}
${FragmentNodeInterfaceFragmentDoc}
${FragmentNodeTeaserUnionFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Node(variables: DrupalTypes.NodeQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.NodeQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.NodeQuery>({ document: NodeDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Node', 'query', variables);
    },
    AllNodes(variables?: DrupalTypes.AllNodesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.AllNodesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.AllNodesQuery>({ document: AllNodesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AllNodes', 'query', variables);
    },
    Courses(variables?: DrupalTypes.CoursesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.CoursesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.CoursesQuery>({ document: CoursesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Courses', 'query', variables);
    },
    EventSeries(variables?: DrupalTypes.EventSeriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.EventSeriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.EventSeriesQuery>({ document: EventSeriesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'EventSeries', 'query', variables);
    },
    Events(variables?: DrupalTypes.EventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.EventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.EventsQuery>({ document: EventsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Events', 'query', variables);
    },
    News(variables?: DrupalTypes.NewsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.NewsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.NewsQuery>({ document: NewsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'News', 'query', variables);
    },
    BasicPages(variables?: DrupalTypes.BasicPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.BasicPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.BasicPagesQuery>({ document: BasicPagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BasicPages', 'query', variables);
    },
    People(variables?: DrupalTypes.PeopleQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.PeopleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.PeopleQuery>({ document: PeopleDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'People', 'query', variables);
    },
    Policies(variables?: DrupalTypes.PoliciesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.PoliciesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.PoliciesQuery>({ document: PoliciesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Policies', 'query', variables);
    },
    Publications(variables?: DrupalTypes.PublicationsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.PublicationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.PublicationsQuery>({ document: PublicationsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Publications', 'query', variables);
    },
    Media(variables: DrupalTypes.MediaQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.MediaQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.MediaQuery>({ document: MediaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Media', 'query', variables);
    },
    Term(variables: DrupalTypes.TermQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.TermQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.TermQuery>({ document: TermDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Term', 'query', variables);
    },
    OpportunityFiltersTerms(variables?: DrupalTypes.OpportunityFiltersTermsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.OpportunityFiltersTermsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.OpportunityFiltersTermsQuery>({ document: OpportunityFiltersTermsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'OpportunityFiltersTerms', 'query', variables);
    },
    Paragraph(variables: DrupalTypes.ParagraphQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.ParagraphQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.ParagraphQuery>({ document: ParagraphDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Paragraph', 'query', variables);
    },
    ConfigPages(variables?: DrupalTypes.ConfigPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.ConfigPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.ConfigPagesQuery>({ document: ConfigPagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ConfigPages', 'query', variables);
    },
    Menu(variables?: DrupalTypes.MenuQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.MenuQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.MenuQuery>({ document: MenuDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Menu', 'query', variables);
    },
    Route(variables: DrupalTypes.RouteQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.RouteQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.RouteQuery>({ document: RouteDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Route', 'query', variables);
    },
    Redirects(variables?: DrupalTypes.RedirectsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.RedirectsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.RedirectsQuery>({ document: RedirectsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Redirects', 'query', variables);
    },
    stanfordBasicPages(variables?: DrupalTypes.StanfordBasicPagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordBasicPagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordBasicPagesQuery>({ document: StanfordBasicPagesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordBasicPages', 'query', variables);
    },
    stanfordCourses(variables?: DrupalTypes.StanfordCoursesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordCoursesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordCoursesQuery>({ document: StanfordCoursesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordCourses', 'query', variables);
    },
    stanfordEvents(variables?: DrupalTypes.StanfordEventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordEventsQuery>({ document: StanfordEventsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordEvents', 'query', variables);
    },
    stanfordEventsPastEvents(variables?: DrupalTypes.StanfordEventsPastEventsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordEventsPastEventsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordEventsPastEventsQuery>({ document: StanfordEventsPastEventsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordEventsPastEvents', 'query', variables);
    },
    stanfordNews(variables?: DrupalTypes.StanfordNewsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordNewsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordNewsQuery>({ document: StanfordNewsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordNews', 'query', variables);
    },
    stanfordOpportunities(variables?: DrupalTypes.StanfordOpportunitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordOpportunitiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordOpportunitiesQuery>({ document: StanfordOpportunitiesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordOpportunities', 'query', variables);
    },
    stanfordPerson(variables?: DrupalTypes.StanfordPersonQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordPersonQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordPersonQuery>({ document: StanfordPersonDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordPerson', 'query', variables);
    },
    stanfordPublications(variables?: DrupalTypes.StanfordPublicationsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordPublicationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordPublicationsQuery>({ document: StanfordPublicationsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordPublications', 'query', variables);
    },
    stanfordSharedTags(variables?: DrupalTypes.StanfordSharedTagsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.StanfordSharedTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.StanfordSharedTagsQuery>({ document: StanfordSharedTagsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'stanfordSharedTags', 'query', variables);
    },
    search(variables?: DrupalTypes.SearchQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DrupalTypes.SearchQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DrupalTypes.SearchQuery>({ document: SearchDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'search', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;