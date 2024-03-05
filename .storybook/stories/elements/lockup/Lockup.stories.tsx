import type {Meta, StoryObj} from '@storybook/react';
import Lockup from "@components/elements/lockup/lockup";
import {ComponentProps} from "react";
import {Image} from "@lib/gql/__generated__/drupal";

type ComponentStoryProps = ComponentProps<typeof Lockup> & {
  logoUrl?: Image["url"]
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<ComponentStoryProps> = {
  title: 'Design/Elements/Lockup',
  component: Lockup,
  tags: ['autodocs'],
  argTypes: {
    suLockupOptions: {
      options: ['a', 'b', 'd', 'e', 'h', 'i', 'm', 'o', 'p', 'r', 's', 't', 'none'],
      control: {type: "select"}
    },
    suLockupEnabled: {
      control: "boolean"
    },
    suUseThemeLogo: {
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj<ComponentStoryProps>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LockupDisplay: Story = {
  render: ({logoUrl, ...args}) => {
    if(logoUrl) args.suUploadLogoImage = {url: logoUrl, height: 50, width: 300, size: 123}
    return <Lockup {...args}/>
  },
  args: {
    suLine1: "Line 1",
    suLine2: "Line 2",
    suLine3: "Line 3",
    suLine4: "Line 4",
    suLine5: "Line 5",
    suSiteName: "Site Name",
    suUseThemeLogo: true,
    logoUrl: "https://placekitten.com/300/50",
    suLockupEnabled: true,
    suLockupOptions: "none",
  },
};

export const LockupA: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "a"
  }
}
export const LockupB: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "b"
  }
}
export const LockupD: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "d"
  }
}
export const LockupE: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "e"
  }
}
export const LockupH: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "h"
  }
}
export const LockupI: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "i"
  }
}
export const LockupM: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "m"
  }
}
export const LockupO: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "o"
  }
}
export const LockupP: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "p"
  }
}
export const LockupR: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "r"
  }
}
export const LockupS: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "s"
  }
}
export const LockupT: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "t"
  }
}
export const LockupNone: Story = {
  render: LockupDisplay.render,
  args: {
    ...LockupDisplay.args,
    suLockupOptions: "none"
  }
}
