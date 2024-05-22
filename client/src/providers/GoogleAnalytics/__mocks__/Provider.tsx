import React from 'react';

import GoogleAnalyticsContext from '../context';
import { GoogleAnalyticsProviderValues } from '../types';

interface GoogleAnalyticsProviderProps {
  children: React.ReactNode;
}

const GoogleAnalyticsProvider: React.FC<GoogleAnalyticsProviderProps> = ({
  children,
}) => {
  const initialize = jest.fn();
  const set = jest.fn();
  const trackCustomEvent = jest.fn();
  const trackException = jest.fn();
  const trackLogin = jest.fn();
  const trackPageView = jest.fn();
  const trackSearch = jest.fn();
  const trackSelectContent = jest.fn();
  const trackSelectItem = jest.fn();
  const trackViewItem = jest.fn();
  const trackViewItemList = jest.fn();

  const providerValue = React.useMemo<GoogleAnalyticsProviderValues>(
    () => ({
      initialize,
      set,
      trackCustomEvent,
      trackException,
      trackLogin,
      trackPageView,
      trackSearch,
      trackSelectContent,
      trackSelectItem,
      trackViewItem,
      trackViewItemList,
    }),
    [
      initialize,
      set,
      trackCustomEvent,
      trackException,
      trackLogin,
      trackPageView,
      trackSearch,
      trackSelectContent,
      trackViewItem,
      trackViewItemList,
    ],
  );

  return (
    <GoogleAnalyticsContext.Provider value={providerValue}>
      {children}
    </GoogleAnalyticsContext.Provider>
  );
};

export default GoogleAnalyticsProvider;
