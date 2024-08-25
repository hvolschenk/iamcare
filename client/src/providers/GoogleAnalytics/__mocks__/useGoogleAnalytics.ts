import type {
  GoogleAnalyticsProviderValues,
  TrackCustomEventOptions,
  TrackExceptionOptions,
  TrackLoginOptions,
  TrackPageViewOptions,
  TrackSearchOptions,
  TrackSelectContentOptions,
  TrackSelectItemOptions,
  TrackShareOptions,
  TrackViewItemListOptions,
  TrackViewItemOptions,
} from '../types';

export const initialize = jest.fn<void, []>();
// biome-ignore lint/suspicious/noExplicitAny: This value is passed on to ReactGa and thus I know nothing more
export const set = jest.fn<void, [Record<string, any>]>();
export const trackCustomEvent = jest.fn<void, [TrackCustomEventOptions]>();
export const trackException = jest.fn<void, [TrackExceptionOptions]>();
export const trackLogin = jest.fn<void, [TrackLoginOptions]>();
export const trackPageView = jest.fn<void, [TrackPageViewOptions]>();
export const trackSearch = jest.fn<void, [TrackSearchOptions]>();
export const trackSelectContent = jest.fn<void, [TrackSelectContentOptions]>();
export const trackSelectItem = jest.fn<void, [TrackSelectItemOptions]>();
export const trackShare = jest.fn<void, [TrackShareOptions]>();
export const trackViewItem = jest.fn<void, [TrackViewItemOptions]>();
export const trackViewItemList = jest.fn<void, [TrackViewItemListOptions]>();

const useGoogleAnalytics = (): GoogleAnalyticsProviderValues => ({
  initialize,
  set,
  trackCustomEvent,
  trackException,
  trackLogin,
  trackPageView,
  trackSearch,
  trackSelectContent,
  trackSelectItem,
  trackShare,
  trackViewItem,
  trackViewItemList,
});

export default useGoogleAnalytics;
