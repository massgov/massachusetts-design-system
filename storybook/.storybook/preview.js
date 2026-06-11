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
          'Base',
          ['Icon', ['Docs', 'Demo', 'All Icons']],
          'Components',
          ['Button', ['Overview', 'Dev', 'Demo']]
        ],
        includeNames: true
      }
    },
    controls: {
      sort: 'none',
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
