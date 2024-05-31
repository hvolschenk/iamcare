import ChatIcon from '@mui/icons-material/Chat';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { Item } from '~/src/types/Item';
import { threadCreate, user as userURL } from '~/src/urls';

interface GiverProps {
  item: Item;
}

const Giver: React.FC<GiverProps> = ({ item }) => {
  const { user } = useAuthentication();
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));

  const isDisabled = React.useMemo<boolean>(
    () => user?.id === item.user.id,
    [item, user],
  );

  return (
    <List>
      <ListItem
        disablePadding
        secondaryAction={
          <React.Fragment>
            {isMediumUp && (
              <Button
                color="secondary"
                component={Link}
                data-testid="item__action--thread-create"
                disabled={isDisabled}
                startIcon={<ChatIcon />}
                sx={{ display: { md: 'inline-flex', xs: 'none' } }}
                to={threadCreate(item.id.toString())}
                variant="contained"
              >
                {l10n.itemContactGiver}
              </Button>
            )}
            {!isMediumUp && (
              <IconButton
                color="secondary"
                component={Link}
                data-testid="item__action--thread-create"
                disabled={isDisabled}
                sx={{ display: { md: 'none', xs: 'flex' } }}
                to={threadCreate(item.id.toString())}
              >
                <ChatIcon />
              </IconButton>
            )}
          </React.Fragment>
        }
      >
        <ListItemButton
          component={Link}
          selected
          to={userURL(item.user.id.toString())}
        >
          <ListItemAvatar>
            <Avatar
              alt={item.user.name}
              slotProps={{
                img: {
                  referrerPolicy: 'no-referrer',
                },
              }}
              src={item.user.avatar}
            />
          </ListItemAvatar>
          <ListItemText
            primary={item.user.name}
            primaryTypographyProps={{ noWrap: true, textOverflow: 'ellipsis' }}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default Giver;
