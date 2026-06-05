import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-styles/index.css';
import './preview.css';
import { massdsDocsTheme } from './theme';

const preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Overview',
          ['Introduction'],
          'Components',
          ['Button', ['Docs', 'Demo', 'Examples']]
        ],
        includeNames: true
      }
    },
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
