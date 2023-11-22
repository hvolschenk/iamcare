import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { Link } from 'react-router-dom';

import { useAuthentication } from '~/src/providers/Authentication';
import { Thread } from '~/src/types/Thread';
import { User } from '~/src/types/User';
import { thread as threadURL } from '~/src/urls';

interface ThreadsListProps {
  threads: Thread[];
}

const ThreadsList: React.FC<ThreadsListProps> = ({ threads }) => {
  const { user } = useAuthentication() as { user: User };

  const getOtherUser = React.useCallback(
    (thread: Thread): User =>
      thread.userGiver.id === user.id ? thread.userReceiver : thread.userGiver,
    [user],
  );

  return (
    <List>
      {threads.map((thread) => (
        <ListItem disablePadding key={thread.id}>
          <ListItemButton
            component={Link}
            data-testid="threads__thread"
            to={threadURL(thread.id.toString())}
          >
            <ListItemAvatar>
              <Badge
                color="secondary"
                invisible={!thread.hasUnreadMessages}
                variant="dot"
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  badgeContent={
                    <Avatar
                      alt={getOtherUser(thread).name}
                      src={getOtherUser(thread).avatar}
                      sx={{
                        border: (theme) =>
                          `2px solid ${theme.palette.background.paper}`,
                        height: 22,
                        width: 22,
                      }}
                    />
                  }
                >
                  <Avatar
                    alt={thread.item.name}
                    src={thread.item.images[0].url}
                  />
                </Badge>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={thread.item.name}
              secondary={thread.messages[thread.messages.length - 1].message}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ThreadsList;
