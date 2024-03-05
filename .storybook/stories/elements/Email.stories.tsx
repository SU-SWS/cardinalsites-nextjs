import type {Meta, StoryObj} from '@storybook/react';
import Email from "@components/elements/email";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Email> = {
  title: 'Design/Elements/Email',
  component: Email,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Email>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const EmailElement: Story = {
  args: {
    email: "foo@bar.com"
  },
};
