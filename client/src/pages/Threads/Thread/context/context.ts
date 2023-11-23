import React from 'react';

import { ThreadProviderValues } from './types';

const ThreadContext = React.createContext<ThreadProviderValues>(
  {} as ThreadProviderValues,
);

export default ThreadContext;
