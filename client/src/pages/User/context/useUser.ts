import React from 'react';

import UserContext from './context';

const useUser = () => {
  const context = React.useContext(UserContext);
  return context;
};

export default useUser;
