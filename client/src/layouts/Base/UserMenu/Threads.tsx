import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';

import unreadThreadsCount from '~/src/api/threads/unread';
import { threads as threadsURL } from '~/src/urls';

const Threads: React.FC = () => {
  const { data, status } = useQuery({
    queryFn: () => unreadThreadsCount(),
    queryKey: ['threads', 'unread'],
  });

  return (
    <IconButton component={Link} to={threadsURL()}>
      <Badge
        badgeContent={data?.data.unreadThreads}
        color="secondary"
        data-testid="user__threads__unread"
        invisible={
          status === 'error' ||
          status === 'pending' ||
          data.data.unreadThreads <= 0
        }
        variant="standard"
      >
        <MailIcon />
      </Badge>
    </IconButton>
  );
};

export default Threads;
