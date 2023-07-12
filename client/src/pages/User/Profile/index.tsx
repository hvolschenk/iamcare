import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { root, userItems } from '~/src/urls';

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
          <CardHeader
            subheader={l10n.formatString(l10n.itemsLatestX, { countItems: 5 })}
            title={l10n.items}
          />
          <CardContent>
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  data-testid="user-profile__action--items"
                  to={userItems(user.id.toString())}
                >
                  <ListItemText
                    primary={
                      <span data-testid="user-profile__action--items__text">
                        {isLoggedInUser
                          ? l10n.userItemsManage
                          : l10n.userItemsView}
                      </span>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default Profile;
