import React from 'react';

import { Thread } from '~/src/types/Thread';

export interface ThreadProviderValues {
  setThread: React.Dispatch<React.SetStateAction<Thread>>;
  thread: Thread;
}
