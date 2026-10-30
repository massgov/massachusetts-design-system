// The manager owns analytics; docs in the preview iframe use the same window.
export function trackAnalyticsEvent(eventName, parameters, targetWindow = window) {
  if (targetWindow.__MASSDS_GTM_ENABLED__) {
    targetWindow.dataLayer = targetWindow.dataLayer || [];
    targetWindow.dataLayer.push({ ...parameters, event: eventName });
    return true;
  }

  if (typeof targetWindow.gtag === 'function') {
    targetWindow.gtag('event', eventName, parameters);
    return true;
  }

  return false;
}
