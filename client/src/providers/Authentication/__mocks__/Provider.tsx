import React from 'react';

import type { User } from '~/src/types/User';

import AuthenticationContext from '../context';

interface ProviderProps {
  children: React.ReactNode;
  value?: User;
}

const Provider: React.FC<ProviderProps> = ({ children, value }) => {
  const [user, setUser] = React.useState(value);
  const providerValue = React.useMemo(() => ({ setUser, user }), [user]);

  return (
    <AuthenticationContext.Provider value={providerValue}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export default Provider;
