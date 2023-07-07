import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import { useGoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import csrfToken from '~/src/api/authenticate/csrfToken';
import authenticateGoogle from '~/src/api/user/authenticateGoogle';
import GoogleG from '~/src/images/GoogleG';
import l10n from '~/src/l10n';

import { AuthenticationProviderProps } from '../types';

const Google: React.FC<AuthenticationProviderProps> = ({
  isSubmitting,
  onError,
  onStart,
  onSuccess,
}) => {
  const queryCSRFToken = useMutation(['csrf'], csrfToken);
  const queryGoogleLogin = useMutation(
    ['authenticate', 'google'],
    authenticateGoogle,
  );

  const googleLogin = useGoogleLogin({
    onError: () => {
      onError(l10n.authenticateGoogleErrorLoginFailed);
    },
    onNonOAuthError: () => {
      onError(l10n.authenticateGoogleErrorLoginFailed);
    },
    onSuccess: async (tokenResponse) => {
      try {
        await queryCSRFToken.mutateAsync();
        const { data: user } = await queryGoogleLogin.mutateAsync(
          tokenResponse.access_token,
        );
        onSuccess(user);
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
