import React from 'react';

import ThreadContext from './context';

const useThread = () => {
  const context = React.useContext(ThreadContext);
  return context;
};

export default useThread;
