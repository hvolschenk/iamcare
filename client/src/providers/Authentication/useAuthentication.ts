import React from 'react';

import AuthenticationContext from './context';

const useAuthentication = () => {
  const context = React.useContext(AuthenticationContext);
  return context;
};

export default useAuthentication;
