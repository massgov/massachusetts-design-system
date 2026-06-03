import { create } from 'storybook/theming';
import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-styles/index.css';

const docsTheme = create({
  base: 'light',
  fontBase: '"Noto Sans", Arial, sans-serif',
  fontCode: '"SFMono-Regular", Consolas, monospace'
});

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      theme: docsTheme,
      toc: {
        headingSelector: 'h2',
        title: 'On this page'
      }
    },
    layout: 'centered'
  }
};

export default preview;
