import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import React from 'react';

import type { Message as ThreadMessage } from '~/src/types/Thread';
import type { User } from '~/src/types/User';

interface MessageProps {
  messages: ThreadMessage['message'][];
  position: 'left' | 'right';
  user: User;
}

const Message: React.FC<MessageProps> = ({ messages, position, user }) => (
  <Grid
    container
    direction={position === 'left' ? 'row' : 'row-reverse'}
    marginBottom={2}
    spacing={2}
  >
    <Grid item>
      <Avatar
        alt={user.name}
        slotProps={{
          img: {
            referrerPolicy: 'no-referrer',
          },
        }}
        src={user.avatar}
      />
    </Grid>
    <Grid item xs={8}>
      {messages.map((message, index) => (
        <Typography
          data-testid="thread__message"
          // biome-ignore lint/suspicious/noArrayIndexKey: The messages are ordered
          key={index}
          sx={{
            backgroundColor: (theme) =>
              position === 'left'
                ? alpha(theme.palette.primary.light, 0.75)
                : alpha(theme.palette.secondary.light, 0.75),
            borderRadius: 1,
            color: (theme) =>
              position === 'left'
                ? theme.palette.primary.contrastText
                : theme.palette.secondary.contrastText,
            marginBottom: 2,
            padding: (theme) => theme.spacing(1),
            paddingX: (theme) => theme.spacing(2),
          }}
        >
          {message}
        </Typography>
      ))}
    </Grid>
  </Grid>
);

export default Message;
