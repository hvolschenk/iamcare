import React from 'react';

import { noop } from '~/src/shared/functions';

import { AuthenticationProviderValues } from './types';

const AuthenticationContext = React.createContext<AuthenticationProviderValues>(
  {
    setUser: noop,
  },
);

export default AuthenticationContext;
