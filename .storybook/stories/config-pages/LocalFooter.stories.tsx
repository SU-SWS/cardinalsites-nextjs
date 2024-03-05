import type {Meta, StoryObj} from '@storybook/react';

import LocalFooter from "@components/config-pages/local-footer";
import {ComponentProps} from "react";

type ComponentStoryProps = ComponentProps<typeof LocalFooter> & {}

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
    suFooterEnabled: {control: "boolean"}
  }
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LocalFooterDisplay: Story = {
  args: {
    suFooterEnabled: true,
    suLocalFootAction: [
      {title: "Action link 1", url: "https://localhost", internal: false},
      {title: "Action link 2", url: "https://localhost", internal: false}
    ],
    suLocalFootAddress: {
      additionalName: "additional_name",
      addressLine1: "address_line1",
      addressLine2: "address_line2",
      administrativeArea: "administrative_area",
      country: {code: "country_code"},
      familyName: "family_name",
      givenName: "given_name",
      locality: "locality",
      organization: "organization",
      postalCode: "postal_code",
      sortingCode: "sorting_code",
    },
    suLocalFootFButton: "suLocalFoot_f_button",
    suLocalFootFIntro: {processed: "suLocalFoot_f_intro"},
    suLocalFootFMethod: "suLocalFoot_f_method",
    suLocalFootFUrl: {title: "Form Action url", url: "https://localhost", internal: false},
    suLocalFootLine1: "suLocalFoot_line_1",
    suLocalFootLine2: "suLocalFoot_line_2",
    suLocalFootLine3: "suLocalFoot_line_3",
    suLocalFootLine4: "suLocalFoot_line_4",
    suLocalFootLine5: "suLocalFoot_line_5",
    suLocalFootLocImg: null,
    suLocalFootLocLink: {title: "suLocalFoot_loc_link", url: "https://localhost", internal: false},
    suLocalFootPrCo: {processed: "suLocalFoot_pr_co"},
    suLocalFootPrimary: [
      {title: "Primary link 1", url: "https://localhost", internal: false},
      {title: "Primary link 2", url: "https://localhost", internal: false}
    ],
    suLocalFootPrimeH: "suLocalFoot_prime_h",
    suLocalFootSeCo: {processed: "suLocalFoot_se_co"},
    suLocalFootSecond: [
      {title: "Second Link 1", url: "https://localhost", internal: false},
      {title: "Second Link 2", url: "https://localhost", internal: false}
    ],
    suLocalFootSecondH: "suLocalFoot_second_h",
    suLocalFootSocial: [
      {title: "Facebook", url: "https://localhost", internal: false},
      {title: "YouTube", url: "https://localhost", internal: false}
    ],
    suLocalFootSunetT: "suLocalFoot_sunet_t",
    suLocalFootTr2Co: {processed: "suLocalFoot_tr2_co"},
    suLocalFootTrCo: {processed: "suLocalFoot_tr_co"},
    suLocalFootUseLoc: true,
    suLocalFootUseLogo: true,
    suLocalFootLocOp: "suLocalFoot_loc_op",
  },
};
