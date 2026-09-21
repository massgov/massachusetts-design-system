import { addons } from 'storybook/manager-api';
import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-styles/index.css';
import '@massds/mds-components/state-banner.css';
import storybookPackage from '../package.json';
import { massdsManagerTheme } from './theme';

addons.setConfig({
  theme: massdsManagerTheme
});

// Mount the state banner in the Storybook preview area
const stateBannerId = 'storybook-main-banner';
const toolbarSelector = '.sb-bar[data-testid="sb-preview-toolbar"]';
const storybookBasePath = window.__MASSDS_STORYBOOK_BASE_PATH__ || '/';
const stateBannerHtmlUrl = new URL(
  `${storybookBasePath.replace(/\/?$/, '/')}components/state-banner/state-banner.html`,
  window.location.origin
).href;
const stateAssetsVersion = storybookPackage.dependencies['@massds/mds-assets'];
const stateSealSrc = `https://unpkg.com/@massds/mds-assets@${stateAssetsVersion}/dist/state-seal/state-seal-white.png`;
let stateBannerMarkup;

async function loadStateBannerMarkup() {
  if (!stateBannerMarkup) {
    stateBannerMarkup = fetch(stateBannerHtmlUrl).then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load the State Banner: ${response.status}`);
      }

      return response.text();
    });
  }

  return stateBannerMarkup;
}

async function mountStateBanner() {
  const toolbar = document.querySelector(toolbarSelector);

  if (!toolbar || !toolbar.parentElement) {
    return;
  }

  const previewContainer = toolbar.parentElement;
  let banner = document.getElementById(stateBannerId);

  if (!banner) {
    banner = document.createElement('div');
    banner.id = stateBannerId;
    previewContainer.insertBefore(banner, toolbar);

    const bannerTemplate = document.createElement('template');

    bannerTemplate.innerHTML = await loadStateBannerMarkup();
    bannerTemplate.content
      .querySelector('.mds-state-banner__seal')
      ?.setAttribute('src', stateSealSrc);
    banner.append(bannerTemplate.content);
  }

  if (banner.parentElement !== previewContainer || banner.nextElementSibling !== toolbar) {
    previewContainer.insertBefore(banner, toolbar);
  }
}

const storybookRoot = document.getElementById('root');

if (storybookRoot) {
  new MutationObserver(() => {
    mountStateBanner().catch((error) => console.error(error));
  }).observe(storybookRoot, {
    childList: true,
    subtree: true
  });
  mountStateBanner().catch((error) => console.error(error));
}


// GA4 SPA route tracking for Storybook
let lastTrackedView;

function getStorybookView() {
  const url = new URL(window.location.href);
  const path = url.searchParams.get('path');

  if (!path) {
    return null;
  }

  const match = path.match(/^\/(docs|story)\/([^/]+)$/);

  if (!match) {
    return null;
  }

  url.search = new URLSearchParams({ path }).toString();

  return {
    key: path,
    pageLocation: url.toString(),
    storyId: match[2],
    viewKind: match[1]
  };
}

function trackStorybookView() {
  if (typeof window.gtag !== 'function') {
    return;
  }

  const view = getStorybookView();

  if (!view || view.key === lastTrackedView) {
    return;
  }

  lastTrackedView = view.key;

  window.gtag('event', 'page_view', {
    page_location: view.pageLocation,
    page_title: document.title
  });
  window.gtag('event', 'storybook_view', {
    story_id: view.storyId,
    view_kind: view.viewKind
  });
}

function trackAfterNavigation() {
  queueMicrotask(trackStorybookView);
}

for (const method of ['pushState', 'replaceState']) {
  const originalMethod = window.history[method];

  window.history[method] = function (...args) {
    const result = originalMethod.apply(this, args);
    trackAfterNavigation();
    return result;
  };
}

window.addEventListener('popstate', trackAfterNavigation);
window.addEventListener('hashchange', trackAfterNavigation);
trackAfterNavigation();
