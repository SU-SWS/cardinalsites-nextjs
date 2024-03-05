import type {Meta, StoryObj} from '@storybook/react';

import Heading from "@components/elements/headers"

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Heading> = {
  title: 'Design/Elements/Header',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    level: {
      description: "Heading level for the <h#> tag",
      control: {type: 'number', min: 1, max: 6}
    },
    children: {
      description: "String, markup, or JSX Element to be wrapped in the header tag"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const H1HeadingElement: Story = {
  args: {
    children: 'Nulla scelerisque vivamus commodo',
    level: 1,
  },
};

export const H2HeadingElement: Story = {
  args: {
    children: 'Nulla scelerisque vivamus commodo',
    level: 2,
  },
};
export const LinkedH2HeadingElement: Story = {
  args: {
    children: <a href="#">Nulla scelerisque vivamus commodo</a>,
    level: 2,
  },
};
export const H3HeadingElement: Story = {
  args: {
    children: 'Nulla scelerisque vivamus commodo',
    level: 3,
  },
};
export const LinkedHH3HeadingElement: Story = {
  args: {
    children: <a href="#">Nulla scelerisque vivamus commodo</a>,
    level: 3,
  },
};

export const H4HeadingElement: Story = {
  args: {
    children: 'Nulla scelerisque vivamus commodo',
    level: 4,
  },
};
export const LinkedHH4HeadingElement: Story = {
  args: {
    children: <a href="#">Nulla scelerisque vivamus commodo</a>,
    level: 4,
  },
};

export const H5HeadingElement: Story = {
  args: {
    children: 'Nulla scelerisque vivamus commodo',
    level: 5,
  },
};
export const LinkedHH5HeadingElement: Story = {
  args: {
    children: <a href="#">Nulla scelerisque vivamus commodo</a>,
    level: 5,
  },
};

export const H6HeadingElement: Story = {
  args: {
    children: 'Nulla scelerisque vivamus commodo',
    level: 6,
  },
};
export const LinkedHH6HeadingElement: Story = {
  args: {
    children: <a href="#">Nulla scelerisque vivamus commodo</a>,
    level: 6,
  },
};
