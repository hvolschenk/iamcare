import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Avatar from '@mui/material/Avatar';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { authentication, user as userURL } from '~/src/urls';

const User: React.FC = () => {
  const { user } = useAuthentication();

  if (!user) {
    return (
      <BottomNavigationAction
        component={Link}
        icon={<AccountCircleIcon />}
        label={l10n.authenticateActionLogin}
        showLabel
        to={authentication({})}
      />
    );
  }

  return (
    <BottomNavigationAction
      component={Link}
      icon={
        <Avatar
          alt={user.name}
          data-testid="authentication__user-menu__avatar--mobile"
          slotProps={{
            img: { referrerPolicy: 'no-referrer' },
          }}
          src={user.avatar}
          sx={{
            height: (theme) => theme.spacing(3),
            width: (theme) => theme.spacing(3),
          }}
        />
      }
      label={l10n.userProfile}
      showLabel
      to={userURL(user.id.toString())}
    />
  );
};

export default User;
