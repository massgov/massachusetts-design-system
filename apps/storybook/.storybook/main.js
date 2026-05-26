import { mergeConfig } from 'vite';

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|mjs)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  viteFinal: async (config) => mergeConfig(config, {
    build: {
      chunkSizeWarningLimit: 1200
    },
    resolve: {
      alias: {
        path: 'path-browserify'
      }
    }
  })
};

export default config;
