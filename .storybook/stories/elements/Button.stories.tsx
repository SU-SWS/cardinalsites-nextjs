import type {Meta, StoryObj} from '@storybook/react';

import Button from "@components/elements/button";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  title: 'Design/Elements/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    href: {
      description: "Link url"
    },
    buttonElem: {
      description: "Use a <button> element",
      control: "boolean"
    },
    big: {
      description: "Big button",
      control: "boolean"
    },
    secondary: {
      description: "Secondary button style",
      control: "boolean"
    },
    centered: {
      description: "Center the button",
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ButtonElement: Story = {
  args: {
    href: "http://localhost",
    children: 'Button Text',
  },
};
