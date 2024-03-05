import type {Meta, StoryObj} from '@storybook/react';

import SideNav from "@components/menu/side-nav";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof SideNav> = {
  title: 'Design/Menu/Side Nav',
  component: SideNav,
  tags: ['autodocs'],
  argTypes: {
    menuItems: {
      table: {
        disable: true,
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof SideNav>;

const defaultMenuProps = {children: [], attributes: {}, expanded: true, internal: true}
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const SideNavComponent: Story = {
  args: {
    menuItems: [
      {id: "1", title: "First Item", url: "#", ...defaultMenuProps},
      {
        id: "4",
        title: "Parent Item",
        url: "/foo",
        ...defaultMenuProps,
        children: [
          {id: "5", title: "First Item", url: "/foo/bar", ...defaultMenuProps},
          {
            id: "6",
            title: "Second Item",
            url: "/foo/baz",
            ...defaultMenuProps,
            children: [
              {id: "8", title: "First Item", url: "/foo/baz/foo", ...defaultMenuProps},
              {id: "9", title: "Second Item", url: "/foo/baz/bar", ...defaultMenuProps},
              {id: "10", title: "Third Item", url: "/foo/baz/bin", ...defaultMenuProps},
            ]
          },
          {id: "7", title: "Third Item", url: "/foo/bin", ...defaultMenuProps},
        ]
      },
      {id: "2", title: "Second Item", url: "/bar", ...defaultMenuProps},
      {id: "3", title: "Third Item", url: "/baz", ...defaultMenuProps},
    ],
    activeTrail: ["4", "6", "8"],
  },
};
