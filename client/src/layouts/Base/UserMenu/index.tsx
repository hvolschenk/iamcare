import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { authentication } from '~/src/urls';

import Profile from './Profile';
import Threads from './Threads';

const UserMenu: React.FC = () => {
  const { user } = useAuthentication();

  if (!user) {
    return (
      <Button
        component={Link}
        data-testid="authentication__user-menu__login"
        startIcon={<AccountCircleIcon />}
        to={authentication({})}
      >
        {l10n.authenticateActionLogin}
      </Button>
    );
  }

  return (
    <Stack direction="row" spacing={2}>
      <Threads />
      <Profile user={user} />
    </Stack>
  );
};

export default UserMenu;
