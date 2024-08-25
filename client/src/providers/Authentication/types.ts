import React from 'react';

import type { User } from '~/src/types/User';

export interface AuthenticationProviderValues {
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  user?: User;
}
