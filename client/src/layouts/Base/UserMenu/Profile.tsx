import Avatar from '@mui/material/Avatar';
import React from 'react';
import { Link } from 'react-router-dom';

import type { User } from '~/src/types/User';
import { user as userURL } from '~/src/urls';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => (
  <Avatar
    alt={user.name}
    component={Link}
    data-testid="authentication__user-menu__avatar"
    slotProps={{
      img: {
        referrerPolicy: 'no-referrer',
      },
    }}
    src={user.avatar}
    to={userURL(user.id.toString())}
  />
);

export default Profile;
