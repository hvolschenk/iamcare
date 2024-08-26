import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import authenticateMe from '~/src/api/user/me';
import FullPageLoader from '~/src/components/FullPageLoader';
import configuration from '~/src/configuration';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import type { User } from '~/src/types/User';

import AuthenticationContext from './context';
import type { AuthenticationProviderValues } from './types';

interface AuthenticationProviderProps {
  children: React.ReactNode;
  value?: User;
}

const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({
  children,
  value,
}) => {
  const [user, setUser] = React.useState<User | undefined>(value);
  const { set } = useGoogleAnalytics();

  const providerValue = React.useMemo<AuthenticationProviderValues>(
    () => ({ setUser, user }),
    [user],
  );

  const { data, refetch, status } = useQuery({
    enabled: !user,
    queryFn: authenticateMe,
    queryKey: ['authenticate', 'me'],
  });

  React.useEffect(() => {
    if (status === 'success') {
      setUser(data.data || undefined);
      set({ userId: data.data?.id || null });
    }
  }, [data, set, status]);

  if (status === 'error') {
    return (
      <Container>
        <Alert
          action={
            <Button
              data-testid="authentication-provider__error__loading__action"
              onClick={() => refetch()}
            >
              {l10n.actionTryAgain}
            </Button>
          }
          data-testid="authentication-provider__error__loading"
          severity="error"
        >
          {l10n.authenticateProviderErrorLoading}
        </Alert>
      </Container>
    );
  }

  if (status === 'pending' && !user) {
    return <FullPageLoader />;
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
