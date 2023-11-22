import ListIcon from '@mui/icons-material/List';
import MailIcon from '@mui/icons-material/Mail';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { root, threads, userItems } from '~/src/urls';

import { useUser } from '../context';

const Profile: React.FC = () => {
  const { user: loggedInUser } = useAuthentication();
  const { user } = useUser();

  const isLoggedInUser = React.useMemo(
    () => loggedInUser?.id === user.id,
    [loggedInUser, user],
  );

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[{ title: l10n.home, url: root() }, { title: user.name }]}
        title={user.name}
      />
      <Avatar
        alt={user.name}
        imgProps={{
          referrerPolicy: 'no-referrer',
        }}
        src={user.avatar}
      />

      <Box marginTop={2}>
        <Card>
          <CardContent>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  data-testid="user-profile__action--items"
                  to={userItems(user.id.toString())}
                >
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span data-testid="user-profile__action--items__text">
                        {isLoggedInUser
                          ? l10n.userItemsManageTitle
                          : l10n.userItemsView}
                      </span>
                    }
                    secondary={
                      isLoggedInUser
                        ? l10n.userItemsManageDescription
                        : undefined
                    }
                  />
                </ListItemButton>
              </ListItem>

              {isLoggedInUser && (
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    data-testid="user-profile__action--threads"
                    to={threads()}
                  >
                    <ListItemIcon>
                      <MailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={l10n.userThreads}
                      secondary={l10n.userThreadsDescription}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default Profile;
