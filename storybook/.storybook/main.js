import { mergeConfig } from 'vite';

const storybookBasePath = process.env.STORYBOOK_BASE_PATH || '/';

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|mjs)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  },
  features: {
    sidebarOnboardingChecklist: false
  },
  viteFinal: async (config) => mergeConfig(config, {
    base: storybookBasePath,
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
