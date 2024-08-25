import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
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
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { Link, useNavigate, useRouteLoaderData } from 'react-router-dom';

import logout from '~/src/api/user/logout';
import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useNotifications } from '~/src/providers/Notifications';
import type { User } from '~/src/types/User';
import { root, threads, userItems } from '~/src/urls';

const Profile: React.FC = () => {
  const { setUser, user: loggedInUser } = useAuthentication();
  const { set, trackCustomEvent } = useGoogleAnalytics();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const user = useRouteLoaderData('user') as User;

  useDocumentTitle([user.name]);

  const isLoggedInUser = React.useMemo(
    () => loggedInUser?.id === user.id,
    [loggedInUser, user],
  );

  const onLogoutError = React.useCallback(() => {
    notify({ message: l10n.userLogoutError });
  }, [notify]);

  const onLogoutSuccess = React.useCallback(() => {
    trackCustomEvent(
      { action: 'logout', category: 'users' },
      { userID: user.id },
    );
    set({ userId: null });
    navigate(root());
    setUser(undefined);
  }, [navigate, set, setUser, trackCustomEvent, user]);

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    mutationKey: ['user', 'logout'],
    onError: onLogoutError,
    onSuccess: onLogoutSuccess,
  });

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[{ title: l10n.home, url: root() }, { title: user.name }]}
        title={user.name}
      />
      <Avatar
        alt={user.name}
        slotProps={{
          img: {
            referrerPolicy: 'no-referrer',
          },
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

              {isLoggedInUser && (
                <ListItem disablePadding>
                  <ListItemButton
                    data-testid="user-profile__action--logout"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={l10n.userLogout}
                      secondary={l10n.formatString(l10n.userLogoutDescription, {
                        applicationName: l10n.applicationName,
                      })}
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
