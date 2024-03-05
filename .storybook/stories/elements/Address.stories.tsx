import type {Meta, StoryObj} from '@storybook/react';
import Address from "@components/elements/address";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Address> = {
  title: 'Design/Elements/Address',
  component: Address,
  tags: ['autodocs'],
  argTypes: {
    singleLine: {control: "boolean"}
  }
};

export default meta;
type Story = StoryObj<typeof Address>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const AddressElement: Story = {
  args: {
    addressLine1: "addressLine1",
    addressLine2: "addressLine2",
    administrativeArea: "administrative_area",
    country: {code: "country_code"},
    locality: "locality",
    organization: "organization",
    postalCode: "postal_code",
    singleLine: false,
  },
};

export const OnelineAddress: Story = {
  args: {
    ...AddressElement.args,
    singleLine: true,
  }
}