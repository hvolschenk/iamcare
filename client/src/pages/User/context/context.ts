import React from 'react';

import { UserProviderValues } from './types';

const UserContext = React.createContext<UserProviderValues>(
  {} as UserProviderValues,
);

export default UserContext;
