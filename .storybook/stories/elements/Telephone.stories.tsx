import type {Meta, StoryObj} from '@storybook/react';
import Telephone from "@components/elements/telephone";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Telephone> = {
  title: 'Design/Elements/Telephone',
  component: Telephone,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Telephone>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const TelephoneElement: Story = {
  args: {
    tel: "123-456-7890"
  },
};
