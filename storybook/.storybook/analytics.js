// GTM runs in the manager; docs in the preview iframe use its data layer.
export function trackAnalyticsEvent(eventName, parameters, targetWindow = window) {
  if (!targetWindow.__MASSDS_GTM_ENABLED__) {
    return false;
  }

  targetWindow.dataLayer = targetWindow.dataLayer || [];
  targetWindow.dataLayer.push({ ...parameters, event: eventName });
  return true;
}
