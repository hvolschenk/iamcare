import React from 'react';
import ReactGA from 'react-ga4';

import configuration from '~/src/configuration';

import GoogleAnalyticsContext from './context';
import { GoogleAnalyticsProviderValues } from './types';

interface GoogleAnalyticsProviderProps {
  children: React.ReactNode;
}

const GoogleAnalyticsProvider: React.FC<GoogleAnalyticsProviderProps> = ({
  children,
}) => {
  const initialize: GoogleAnalyticsProviderValues['initialize'] =
    React.useCallback(() => {
      ReactGA.initialize(configuration.google.analytics.measurementID(), {
        nonce: configuration.google.analytics.nonce(),
      });
    }, []);

  const trackCustomEvent: GoogleAnalyticsProviderValues['trackCustomEvent'] =
    React.useCallback((options) => {
      ReactGA.event(options);
    }, []);

  const trackPageView: GoogleAnalyticsProviderValues['trackPageView'] =
    React.useCallback((options) => {
      ReactGA.send({ hitType: 'pageview', ...options });
    }, []);

  const providerValue = React.useMemo<GoogleAnalyticsProviderValues>(
    () => ({ initialize, trackCustomEvent, trackPageView }),
    [initialize, trackCustomEvent, trackPageView],
  );

  return (
    <GoogleAnalyticsContext.Provider value={providerValue}>
      {children}
    </GoogleAnalyticsContext.Provider>
  );
};

export default GoogleAnalyticsProvider;
