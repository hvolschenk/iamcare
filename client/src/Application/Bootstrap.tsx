import React from 'react';
import { useLocation } from 'react-router-dom';

import configuration from '~/src/configuration';
import { useCookies } from '~/src/providers/Cookies';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';

interface BootstrapProps {
  children: React.ReactNode;
}

const Bootstrap: React.FC<BootstrapProps> = ({ children }) => {
  const { areCookiesAccepted } = useCookies();
  const { initialize, set, trackPageView } = useGoogleAnalytics();
  const location = useLocation();

  React.useEffect(() => {
    const analyticsDisableKey: string = `ga-disable-${configuration.google.analytics.measurementID()}`;
    if (areCookiesAccepted) {
      // @ts-ignore
      window[analyticsDisableKey] = false;
      initialize();
    } else {
      // @ts-ignore
      window[analyticsDisableKey] = true;
    }
  }, [areCookiesAccepted, initialize]);

  React.useEffect(() => {
    const page = `${location.pathname}${location.search}`;
    set({ page });
    trackPageView({ page });
  }, [location, set, trackPageView]);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>{children}</React.Fragment>
  );
};

export default Bootstrap;
