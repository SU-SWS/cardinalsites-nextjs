import type {Meta, StoryObj} from '@storybook/react';
import LocalFooter from "@components/config-pages/local-footer";
import {ComponentProps} from "react";

type ComponentStoryProps = ComponentProps<typeof LocalFooter> & {
  numberOfLinks: number
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Config Pages/Local Footer',
  component: LocalFooter,
  tags: ['autodocs'],
  argTypes: {
    suLocalFootLocOp: {
      description: "Lockup Options",
      options: ['a', 'b', 'd', 'e', 'h', 'i', 'm', 'o', 'p', 'r', 's', 't', 'none'],
      control: {type: "select"}
    },
    suFooterEnabled: {control: "boolean"},
    numberOfLinks: {
      control: {
        type: 'number',
        min: 1,
        max: 20,
      }
    },
  }
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LocalFooterDisplay: Story = {
  render: ({numberOfLinks, ...args}) => {
    const linkList = []
    for (let i=0; i< numberOfLinks; i++) {
      linkList.push("<a href='http://localhost'>Primary Link</a>")
    }
    return <LocalFooter {...args} />
  },
  args: {
    suFooterEnabled: true,
    // Action links
    numberOfLinks: 3,
    suLocalFootAction: [],
    // Office location
    suLocalFootAddress: {
      additionalName: "Additional Organization Name",
      addressLine1: "450 Jane Stanford Way",
      addressLine2: "Address Line 2",
      administrativeArea: "State",
      country: {
        code: "Country Code"
      },
      familyName: "Family Name",
      givenName: "Given Name",
      locality: "Locality",
      organization: "Organization",
      postalCode: "Postal Code",
      sortingCode: "Sorting Code",
    },
    // Footer lockup controls
    suLocalFootUseLoc: true,
    suLocalFootUseLogo: true,
    suLocalFootLocOp: "suLocalFoot_loc_op",
    // Footer lockup lines
    suLocalFootLine1: "Line 1",
    suLocalFootLine2: "Line 2",
    suLocalFootLine3: "Line 3",
    suLocalFootLine4: "Line 4",
    suLocalFootLine5: "Line 5",
    suLocalFootLocImg: null,
    suLocalFootLocLink: {
      title: "suLocalFoot_loc_link",
      url: "https://localhost",
      internal: false
    },
    // Wysiwyg Content Block 1
    suLocalFootPrCo: {processed: "Content Block 1"},
    // Wysiwyg Content Block 2
    suLocalFootSeCo: {processed: "Content Block 2"},
    // Wysiwyg Content Block 3
    suLocalFootTr2Co: {processed: "Content Block 3"},
    // Wysiwyg Content Block 4
    suLocalFootTrCo: {processed: "Content Block 4"},
    // Primary links
    suLocalFootPrimeH: "Primary links",
    suLocalFootPrimary: [
      {title: "Primary link 1", url: "https://localhost", internal: false},
      {title: "Primary link 2", url: "https://localhost", internal: false}
    ],
    // Secondary Links
    suLocalFootSecondH: "Secondary links",
    suLocalFootSecond: [
      {title: "Second Link 1", url: "https://localhost", internal: false},
      {title: "Second Link 2", url: "https://localhost", internal: false}
    ],
   // Social Links
    suLocalFootSocial: [
      {title: "Facebook", url: "https://www.facebook.com/stanford", internal: false},
      {title: "Instagram", url: "https://www.instagram.com/stanford/", internal: false},
      {title: "LinkedIn", url: "https://www.linkedin.com/school/stanford-university/", internal: false},
      {title: "YouTube", url: "https://www.youtube.com/stanford", internal: false},
      {title: "Twitter", url: "https://twitter.com/stanford", internal: false},
    ],
    // SUNet
    suLocalFootSunetT: "suLocalFoot_sunet_t",
  },
};
