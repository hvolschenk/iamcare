import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';

import unreadThreadsCount from '~/src/api/threads/unread';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { threads as threadsURL } from '~/src/urls';

const Threads: React.FC = () => {
  const { user } = useAuthentication();

  const isAuthenticated = React.useMemo<boolean>(() => Boolean(user), [user]);

  const { data, status } = useQuery({
    enabled: isAuthenticated,
    queryFn: unreadThreadsCount,
    queryKey: ['threads', 'unread'],
  });

  if (!isAuthenticated) {
    return null;
  }

  return (
    <BottomNavigationAction
      component={Link}
      icon={
        <Badge
          badgeContent={data?.data.unreadThreads}
          color="secondary"
          data-testid="user__threads__unread--mobile"
          invisible={
            status === 'error' ||
            status === 'pending' ||
            data.data.unreadThreads <= 0
          }
          variant="standard"
        >
          <MailIcon />
        </Badge>
      }
      label={l10n.threads}
      showLabel
      to={threadsURL()}
    />
  );
};

export default Threads;
