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
          'Foundations',
          ['*', ['Overview', 'Code', 'Playground']],
          'Components',
          ['*', ['Overview', 'Guidance', 'Code', 'Playground']]
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
      theme: massdsDocsTheme
    },
    layout: 'centered'
  }
};

export default preview;
