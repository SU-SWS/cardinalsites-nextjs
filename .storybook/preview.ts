import type { Preview } from "@storybook/react";
import '../src/styles/index.css';
import './storybook.css';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        date: /date/,
      },
    },
  },
};

export default preview;
