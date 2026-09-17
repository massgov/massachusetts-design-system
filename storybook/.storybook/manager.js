import { addons } from 'storybook/manager-api';
import { massdsManagerTheme } from './theme';

addons.setConfig({
  theme: massdsManagerTheme
});

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
