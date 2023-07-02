import React from 'react';

import { User } from '~/src/types/User';

import UserContext from './context';
import { UserProviderValues } from './types';

interface UserProviderProps {
  children: React.ReactNode;
  value: User;
}

const UserProvider: React.FC<UserProviderProps> = ({ children, value }) => {
  const [user, setUser] = React.useState<User>(value);

  const providerValue = React.useMemo<UserProviderValues>(
    () => ({ setUser, user }),
    [setUser, user],
  );

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
