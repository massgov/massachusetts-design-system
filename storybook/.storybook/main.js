import { mergeConfig } from 'vite';
import remarkGfm from 'remark-gfm';

const storybookBasePath = process.env.STORYBOOK_BASE_PATH || '/';
const gaMeasurementId = process.env.STORYBOOK_GA_MEASUREMENT_ID;
const hasValidGaMeasurementId = /^G-[A-Z0-9]+$/.test(gaMeasurementId || '');

const googleAnalyticsTag = hasValidGaMeasurementId
  ? `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = window.gtag || gtag;
      window.gtag('js', new Date());
      window.gtag('config', ${JSON.stringify(gaMeasurementId)}, { send_page_view: false });
    </script>
  `
  : '';

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|mjs)'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm]
          }
        }
      }
    },
    '@storybook/addon-a11y'
  ],
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
  managerHead: (head) => `${head}${googleAnalyticsTag}`,
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
