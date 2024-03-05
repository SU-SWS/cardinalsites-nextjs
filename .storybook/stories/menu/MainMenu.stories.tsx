import type {Meta, StoryObj} from '@storybook/react';

import MainMenu from "@components/menu/main-menu";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof MainMenu> = {
  title: 'Design/Menu/Main Menu',
  component: MainMenu,
  tags: ['autodocs'],
  argTypes: {}
};

export default meta;
type Story = StoryObj<typeof MainMenu>;

const defaultMenuProps = {children: [], attributes: {}, expanded: true, internal: true}
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const MainMenuComponent: Story = {
  args: {
    menuItems: [
      {id: "1", title: "First Item", url: "#", ...defaultMenuProps},
      {
        id: "4",
        title: "Parent Item",
        url: "#",
        ...defaultMenuProps,
        children: [
          {id: "5", title: "First Item", url: "#", ...defaultMenuProps},
          {
            id: "6",
            title: "Second Item",
            url: "#",
            ...defaultMenuProps,
            children: [
              {id: "8", title: "First Item", url: "#", ...defaultMenuProps},
              {id: "9", title: "Second Item", url: "#", ...defaultMenuProps},
              {id: "10", title: "Third Item", url: "#", ...defaultMenuProps},
            ]
          },
          {id: "7", title: "Third Item", url: "#", ...defaultMenuProps},
        ]
      },
      {id: "2", title: "Second Item", url: "#", ...defaultMenuProps},
      {id: "3", title: "Third Item", url: "#", ...defaultMenuProps},
    ]
  },
};
