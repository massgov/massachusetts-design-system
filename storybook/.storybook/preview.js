import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-styles/index.css';
import './preview.css';
import './docs-markdown.css';
import { massdsDocsTheme } from './theme';

const preview = {
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Overview',
          ['Introduction', 'Getting Started'],
          'Foundations',
          ['Design Tokens', 'Color Tokens', ['Overview', 'Guidance', 'Code', 'Playground']],
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
      theme: massdsDocsTheme,
      toc: {
        headingSelector: 'h2,h3',
        title: null
      }
    },
    layout: 'centered'
  }
};

export default preview;
