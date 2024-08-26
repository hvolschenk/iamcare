import React from 'react';

import { noop } from '~/src/shared/functions';

import type { AuthenticationProviderValues } from './types';

const AuthenticationContext = React.createContext<AuthenticationProviderValues>(
  {
    setUser: noop,
  },
);

export default AuthenticationContext;
