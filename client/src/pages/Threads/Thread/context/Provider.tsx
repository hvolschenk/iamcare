import React from 'react';

import { Thread } from '~/src/types/Thread';

import ThreadContext from './context';
import { ThreadProviderValues } from './types';

interface ThreadProviderProps {
  children: React.ReactNode;
  value: Thread;
}

const ThreadProvider: React.FC<ThreadProviderProps> = ({ children, value }) => {
  const [thread, setThread] = React.useState<Thread>(value);

  const providerValue = React.useMemo<ThreadProviderValues>(
    () => ({ setThread, thread }),
    [setThread, thread],
  );

  return (
    <ThreadContext.Provider value={providerValue}>
      {children}
    </ThreadContext.Provider>
  );
};

export default ThreadProvider;
