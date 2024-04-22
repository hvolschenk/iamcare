import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import authenticateMe from '~/src/api/user/me';
import configuration from '~/src/configuration';
import l10n from '~/src/l10n';
import { User } from '~/src/types/User';

import AuthenticationContext from './context';
import { AuthenticationProviderValues } from './types';

interface AuthenticationProviderProps {
  children: React.ReactNode;
  value?: User;
}

const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({
  children,
  value,
}) => {
  const [user, setUser] = React.useState<User | undefined>(value);
  const providerValue = React.useMemo<AuthenticationProviderValues>(
    () => ({ setUser, user }),
    [setUser, user],
  );

  const { data, refetch, status } = useQuery({
    enabled: !user,
    queryFn: authenticateMe,
    queryKey: ['authenticate', 'me'],
  });

  React.useEffect(() => {
    if (status === 'success') {
      setUser(data.data || undefined);
    }
  }, [data, setUser, status]);

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
    return (
      <Container>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Container>
    );
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
