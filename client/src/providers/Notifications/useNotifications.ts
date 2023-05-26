import React from 'react';

import NotificationsContext from './context';

const useNotifications = () => {
  const context = React.useContext(NotificationsContext);
  return context;
};

export default useNotifications;
