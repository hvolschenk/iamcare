import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { authentication, user as userURL } from '~/src/urls';

const UserMenu: React.FC = () => {
  const { user } = useAuthentication();

  if (!user) {
    return (
      <Button
        component={Link}
        startIcon={<AccountCircleIcon />}
        to={authentication()}
      >
        {l10n.authenticateActionLogin}
      </Button>
    );
  }

  return (
    <Avatar
      alt={user.name}
      component={Link}
      imgProps={{
        referrerPolicy: 'no-referrer',
      }}
      src={user.avatar}
      to={userURL(user.id.toString())}
    />
  );
};

export default UserMenu;
