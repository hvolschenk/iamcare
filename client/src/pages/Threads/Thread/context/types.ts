import React from 'react';

import type { Thread } from '~/src/types/Thread';

export interface ThreadProviderValues {
  setThread: React.Dispatch<React.SetStateAction<Thread>>;
  thread: Thread;
}
