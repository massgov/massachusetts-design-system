import { mergeConfig } from 'vite';
import remarkGfm from 'remark-gfm';

const storybookBasePath = process.env.STORYBOOK_BASE_PATH || '/';
const gtmContainerId = process.env.STORYBOOK_GTM_CONTAINER_ID;
const gtmAuth = process.env.STORYBOOK_GTM_AUTH;
const gtmPreview = process.env.STORYBOOK_GTM_PREVIEW;

if (gtmContainerId && !/^GTM-[A-Z0-9]+$/.test(gtmContainerId)) {
  throw new Error('STORYBOOK_GTM_CONTAINER_ID must be a GTM-... container ID.');
}

if (Boolean(gtmAuth) !== Boolean(gtmPreview) || (gtmPreview && !/^env-\d+$/.test(gtmPreview))) {
  throw new Error('Set both STORYBOOK_GTM_AUTH and STORYBOOK_GTM_PREVIEW from the GTM environment snippet.');
}

if (gtmAuth && !gtmContainerId) {
  throw new Error('GTM environment settings require STORYBOOK_GTM_CONTAINER_ID.');
}

const gtmScriptUrl = new URL('https://www.googletagmanager.com/gtm.js');
gtmScriptUrl.searchParams.set('id', gtmContainerId || '');

if (gtmAuth && gtmPreview) {
  gtmScriptUrl.searchParams.set('gtm_auth', gtmAuth);
  gtmScriptUrl.searchParams.set('gtm_preview', gtmPreview);
  gtmScriptUrl.searchParams.set('gtm_cookies_win', 'x');
}

const googleTagManagerTag = gtmContainerId
  ? `
    <script>
      window.__MASSDS_GTM_ENABLED__ = true;
      (function(w,d,s,l){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s);j.async=true;j.src=${JSON.stringify(gtmScriptUrl.toString())};
      f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer');
    </script>
  `
  : '';

const storybookBasePathScript = `
  <script>
    window.__MASSDS_STORYBOOK_BASE_PATH__ = ${JSON.stringify(storybookBasePath)};
  </script>
`;

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|mjs)'],
  staticDirs: [
    {
      from: '../public',
      to: '/'
    },
    {
      from: '../../packages/assets/dist/state-seal',
      to: '/'
    },
    {
      from: '../../packages/components/dist/state-banner',
      to: '/components/state-banner'
    },
    {
      from: '../../packages/components/dist/footer',
      to: '/components/footer'
    }
  ],
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
  managerHead: (head) => `${head}${storybookBasePathScript}${googleTagManagerTag}`,
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
