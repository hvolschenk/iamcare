import { GoogleOAuthProvider } from '@react-oauth/google';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import authenticateMe from '~/src/api/authenticate/me';
import configuration from '~/src/configuration';
import l10n from '~/src/l10n';
import { User } from '~/src/types/User';

import AuthenticationContext from './context';

interface AuthenticationProviderProps {
  children: React.ReactNode;
  value?: User;
}

const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({
  children,
  value,
}) => {
  const [user, setUser] = React.useState<User | undefined>(value);
  const providerValue = React.useMemo(
    () => ({ setUser, user }),
    [setUser, user],
  );

  const { isError, isLoading, refetch } = useQuery(
    ['authenticate', 'me'],
    authenticateMe,
    {
      enabled: !user,
      onSuccess: (response) => {
        setUser(response.data || undefined);
      },
    },
  );

  if (isError) {
    return (
      <div data-testid="authentication-provider__error__loading">
        <p>{l10n.authenticateProviderErrorLoading}</p>
        <button
          data-testid="authentication-provider__error__loading__action"
          onClick={() => refetch()}
          type="button"
        >
          {l10n.actionTryAgain}
        </button>
      </div>
    );
  }

  if (isLoading && !user) {
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={configuration.google.oAuth.clientID()}>
      <AuthenticationContext.Provider value={providerValue}>
        {children}
      </AuthenticationContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default AuthenticationProvider;
