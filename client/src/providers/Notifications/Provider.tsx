import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import React from 'react';

import { NotificationsProviderValues } from '~/src/providers/Notifications/types';
import { noop } from '~/src/shared/functions';

import NotificationsContext from './context';

interface NotificationsProviderProps {
  children: React.ReactNode;
}

const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = React.useState<SnackbarProps[]>([]);

  const notify: NotificationsProviderValues['notify'] = React.useCallback(
    (notification) => {
      setNotifications((currentNotifications) => [
        ...currentNotifications,
        notification,
      ]);
    },
    [setNotifications],
  );

  const onClose = React.useCallback(() => {
    setNotifications(([, ...currentNotifications]) => currentNotifications);
  }, [setNotifications]);

  const providerValue: NotificationsProviderValues = React.useMemo(
    () => ({ notify }),
    [notify],
  );

  return (
    <React.Fragment>
      <NotificationsContext.Provider value={providerValue}>
        {children}
      </NotificationsContext.Provider>
      {notifications.length > 0 && (
        <Snackbar
          autoHideDuration={2500}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...notifications[0]}
          ClickAwayListenerProps={{ onClickAway: noop }}
          data-testid="notifications__notification"
          key={new Date().getTime()}
          onClose={onClose}
          open
        />
      )}
    </React.Fragment>
  );
};

export default NotificationsProvider;
