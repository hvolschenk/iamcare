import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import csrfToken from '~/src/api/authenticate/csrfToken';
import authenticateGoogle from '~/src/api/user/authenticateGoogle';
import GoogleG from '~/src/images/GoogleG';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';

import {
  type AuthenticationProviderProps,
  AuthenticationProviders,
} from '../types';

const Google: React.FC<AuthenticationProviderProps> = ({
  isSubmitting,
  onError,
  onStart,
  onSuccess,
}) => {
  const { trackException } = useGoogleAnalytics();

  const queryCSRFToken = useMutation({
    mutationFn: csrfToken,
    mutationKey: ['csrf'],
  });
  const queryGoogleLogin = useMutation({
    mutationFn: authenticateGoogle,
    mutationKey: ['authenticate', 'google'],
  });

  const googleLogin = useGoogleLogin({
    onError: (error) => {
      trackException({
        description: `Google login error: ${error.error}: ${error.error_description}`,
        fatal: false,
      });
      onError(l10n.authenticateGoogleErrorLoginFailed);
    },
    onNonOAuthError: (error) => {
      trackException({
        description: `Google login error: ${error.type}`,
        fatal: false,
      });
      onError(l10n.authenticateGoogleErrorLoginFailed);
    },
    onSuccess: async (tokenResponse) => {
      try {
        await queryCSRFToken.mutateAsync();
        const { data: user } = await queryGoogleLogin.mutateAsync(
          tokenResponse.access_token,
        );
        onSuccess(user, AuthenticationProviders.GOOGLE);
      } catch (error) {
        onError(l10n.authenticateGoogleErrorLoginFailed);
      }
    },
  });

  const onClick = React.useCallback(() => {
    onStart();
    googleLogin();
  }, [googleLogin, onStart]);

  return (
    <Button
      color="primary"
      data-testid="authentication-button--google"
      disabled={isSubmitting}
      fullWidth
      onClick={onClick}
      startIcon={
        <SvgIcon>
          <GoogleG />
        </SvgIcon>
      }
      type="button"
      variant="contained"
    >
      {l10n.authenticateGoogleActionLogin}
    </Button>
  );
};

export default Google;
