const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|mjs)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;
