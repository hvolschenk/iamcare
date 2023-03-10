import FormHelperText from '@mui/material/FormHelperText';
import React from 'react';

import { useAuthentication } from '~/src/providers/Authentication';
import { User } from '~/src/types/User';

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
      {authenticatedUser && (
        <p data-testid="authentication__user">{authenticatedUser.email}</p>
      )}
      {(Object.keys(authenticationProviders) as AuthenticationProviders[]).map(
        (key) => {
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
        },
      )}
      <FormHelperText data-testid="authentication__error" error>
        {error}
      </FormHelperText>
    </React.Fragment>
  );
};

export default Authentication;
