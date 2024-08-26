import React from 'react';

import type { ThreadProviderValues } from './types';

const ThreadContext = React.createContext<ThreadProviderValues>(
  {} as ThreadProviderValues,
);

export default ThreadContext;
