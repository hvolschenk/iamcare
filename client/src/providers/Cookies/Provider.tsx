import React from 'react';

import configuration from '~/src/configuration';

import CookiesDialog from './CookiesDialog';
import CookiesContext from './context';
import type { CookiesProviderValues } from './types';

interface CookiesProviderProps {
  children: React.ReactNode;
}

const CookiesProvider: React.FC<CookiesProviderProps> = ({ children }) => {
  const [areCookiesAccepted, setAreCookiesAccepted] = React.useState<
    boolean | null
  >(() => {
    const storedConsent = localStorage.getItem('COOKIES_ACCEPTED');
    if (storedConsent) {
      return storedConsent === 'true';
    }
    return null;
  });

  const onCookiesAccept = React.useCallback(() => {
    localStorage.setItem('COOKIES_ACCEPTED', 'true');
    setAreCookiesAccepted(true);
  }, []);

  const onCookiesDecline = React.useCallback(() => {
    localStorage.setItem('COOKIES_ACCEPTED', 'false');
    setAreCookiesAccepted(false);
  }, []);

  const providerValue = React.useMemo<CookiesProviderValues>(
    () => ({
      areCookiesAccepted: areCookiesAccepted === true,
    }),
    [areCookiesAccepted],
  );

  return (
    <CookiesContext.Provider value={providerValue}>
      <CookiesDialog
        isOpen={
          areCookiesAccepted === null &&
          configuration.application.hasCookiesBanner()
        }
        onAccept={onCookiesAccept}
        onDecline={onCookiesDecline}
      />
      {children}
    </CookiesContext.Provider>
  );
};

export default CookiesProvider;
