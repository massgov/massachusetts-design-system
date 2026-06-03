import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-styles/index.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      toc: {
        headingSelector: 'h2',
        title: 'On this page'
      }
    },
    layout: 'centered'
  }
};

export default preview;
