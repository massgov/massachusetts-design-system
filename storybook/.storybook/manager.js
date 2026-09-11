import { addons } from 'storybook/manager-api';
import { STORY_CHANGED } from 'storybook/internal/core-events';
import '@massds/mds-tokens/dist/index.css';
import '@massds/mds-styles/index.css';
import '@massds/mds-components/state-banner.css';
import { renderStorybookStateBanner } from './manager-state-banner.js';
import { massdsManagerTheme } from './theme';

addons.setConfig({
  theme: massdsManagerTheme
});

// Mount the state banner in the Storybook preview area
const stateBannerId = 'storybook-main-banner';
const toolbarSelector = '.sb-bar[data-testid="sb-preview-toolbar"]';

function mountStateBanner() {
  const toolbar = document.querySelector(toolbarSelector);

  if (!toolbar || !toolbar.parentElement) {
    return;
  }

  const previewContainer = toolbar.parentElement;
  let banner = document.getElementById(stateBannerId);

  if (!banner) {
    banner = document.createElement('div');
    banner.id = stateBannerId;
    banner.innerHTML = renderStorybookStateBanner();
  }

  if (banner.parentElement !== previewContainer || banner.nextElementSibling !== toolbar) {
    previewContainer.insertBefore(banner, toolbar);
  }
}

const storybookRoot = document.getElementById('root');

if (storybookRoot) {
  new MutationObserver(mountStateBanner).observe(storybookRoot, {
    childList: true,
    subtree: true
  });
  mountStateBanner();
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

addons.getChannel().on(STORY_CHANGED, trackStorybookView);
window.setTimeout(trackStorybookView, 0);
