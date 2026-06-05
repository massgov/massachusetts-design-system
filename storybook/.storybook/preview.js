import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-styles/index.css';
import { massdsDocsTheme } from './theme';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      theme: massdsDocsTheme,
      toc: {
        headingSelector: 'h2',
        title: 'On this page'
      }
    },
    layout: 'centered'
  }
};

export default preview;
