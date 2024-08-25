import React from 'react';

import { noop } from '~/src/shared/functions';

import type { NotificationsProviderValues } from './types';

const GooglePlacesContext = React.createContext<NotificationsProviderValues>({
  notify: noop,
});

export default GooglePlacesContext;
