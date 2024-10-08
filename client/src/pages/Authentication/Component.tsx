import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { root } from '~/src/urls';

import Google from './Providers/Google';
import {
  type AuthenticationProviderProps,
  AuthenticationProviders,
} from './types';

const authenticationProviders: Record<
  AuthenticationProviders,
  React.ComponentType<AuthenticationProviderProps>
> = {
  [AuthenticationProviders.GOOGLE]: Google,
};

const Authentication: React.FC = () => {
  const [error, setError] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  useDocumentTitle([l10n.authentication]);

  const { setUser } = useAuthentication();
  const { set, trackLogin } = useGoogleAnalytics();
  const location = useLocation();
  const navigate = useNavigate();

  const onError = React.useCallback((errorMessage: string): void => {
    setError(errorMessage);
    setIsSubmitting(false);
  }, []);

  const onStart = React.useCallback(() => {
    setError('');
    setIsSubmitting(true);
  }, []);

  const onSuccessRedirect = React.useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectURI = searchParams.get('redirectURI');
    navigate(redirectURI || root());
  }, [location, navigate]);

  const onSuccess: AuthenticationProviderProps['onSuccess'] = React.useCallback(
    (user, provider) => {
      const methods: Record<AuthenticationProviders, string> = {
        [AuthenticationProviders.GOOGLE]: 'Google',
      };
      setUser(user);
      set({ userId: user.id });
      trackLogin({ method: methods[provider] });
      onSuccessRedirect();
    },
    [onSuccessRedirect, set, setUser, trackLogin],
  );

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: l10n.authentication },
        ]}
        title={l10n.authentication}
      />
      <Card>
        <CardContent>
          {(
            Object.keys(authenticationProviders) as AuthenticationProviders[]
          ).map((key) => {
            const Provider = authenticationProviders[key];
            return (
              <Provider
                isSubmitting={isSubmitting}
                key={key}
                onError={onError}
                onStart={onStart}
                onSuccess={onSuccess}
              />
            );
          })}
          <FormHelperText data-testid="authentication__error" error>
            {error}
          </FormHelperText>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default Authentication;
