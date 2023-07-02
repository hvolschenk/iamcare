import React from 'react';

import { User } from '~/src/types/User';

export interface UserProviderValues {
  setUser: React.Dispatch<React.SetStateAction<User>>;
  user: User;
}
