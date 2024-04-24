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
  const trackCustomEvent = jest.fn();
  const trackPageView = jest.fn();

  const providerValue = React.useMemo<GoogleAnalyticsProviderValues>(
    () => ({
      initialize,
      trackCustomEvent,
      trackPageView,
    }),
    [initialize, trackCustomEvent, trackPageView],
  );

  return (
    <GoogleAnalyticsContext.Provider value={providerValue}>
      {children}
    </GoogleAnalyticsContext.Provider>
  );
};

export default GoogleAnalyticsProvider;
