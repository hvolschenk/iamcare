import {
  GoogleAnalyticsProviderValues,
  TrackCustomEventOptions,
  TrackPageViewOptions,
} from '../types';

export const initialize = jest.fn<void, []>();
export const trackCustomEvent = jest.fn<void, [TrackCustomEventOptions]>();
export const trackPageView = jest.fn<void, [TrackPageViewOptions]>();

const useGoogleAnalytics = (): GoogleAnalyticsProviderValues => ({
  initialize,
  trackCustomEvent,
  trackPageView,
});

export default useGoogleAnalytics;
