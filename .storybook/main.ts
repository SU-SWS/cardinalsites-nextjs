import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import path from "path";
import type {StorybookConfig} from "@storybook/nextjs";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/nextjs",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  typescript: {
    reactDocgen: 'react-docgen',
    check: false,
  },
  stories: [
    "./stories/**/*.mdx",
    "./stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    '@storybook/addon-styling',
    {
      name: '@storybook/addon-styling',
      options: {
        // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
        // For more details on this addon's options.
        postCss: true,
      },
    },
  ],
  docs: {
    autodocs: "tag",
  },
  webpackFinal: async (config) => {
    if (config.resolve) config.resolve.plugins = [new TsconfigPathsPlugin()];
    return config
  },
};
export default config;
