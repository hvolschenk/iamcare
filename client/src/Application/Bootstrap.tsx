import React from 'react';

import configuration from '~/src/configuration';
import { useCookies } from '~/src/providers/Cookies';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';

interface BootstrapProps {
  children: React.ReactNode;
}

const Bootstrap: React.FC<BootstrapProps> = ({ children }) => {
  const { areCookiesAccepted } = useCookies();
  const { initialize } = useGoogleAnalytics();

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

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <React.Fragment>{children}</React.Fragment>
  );
};

export default Bootstrap;
