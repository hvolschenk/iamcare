import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import React from 'react';

import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { User } from '~/src/types/User';
import { root } from '~/src/urls';

import Google from './Providers/Google';
import { AuthenticationProviderProps, AuthenticationProviders } from './types';

const authenticationProviders: Record<
  AuthenticationProviders,
  React.ComponentType<AuthenticationProviderProps>
> = {
  [AuthenticationProviders.GOOGLE]: Google,
};

const Authentication: React.FC = () => {
  const [error, setError] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const { setUser, user: authenticatedUser } = useAuthentication();

  const onError = React.useCallback(
    (errorMessage: string): void => {
      setError(errorMessage);
      setIsSubmitting(false);
    },
    [setError, setIsSubmitting],
  );

  const onStart = React.useCallback(() => {
    setError('');
    setIsSubmitting(true);
  }, [setError, setIsSubmitting]);

  const onSuccess = React.useCallback(
    (user: User) => {
      setError('');
      setIsSubmitting(false);
      setUser(user);
    },
    [setError, setIsSubmitting, setUser],
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
          <Box marginBottom={2}>
            <Alert severity="info">
              {l10n.formatString(l10n.authenticateAlertNoRegistrationRequired, {
                applicationName: l10n.applicationName,
              })}
            </Alert>
          </Box>
          {authenticatedUser && (
            <p data-testid="authentication__user">{authenticatedUser.email}</p>
          )}
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
