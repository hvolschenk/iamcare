import React from 'react';
import { useLoaderData } from 'react-router-dom';

import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import type { Thread as ThreadType } from '~/src/types/Thread';

import Thread from './Thread';
import { Provider as ThreadProvider } from './context';

const ThreadLoader: React.FC = () => {
  const { user } = useAuthentication();
  const thread = useLoaderData() as ThreadType;

  const documentTitle = React.useMemo<string[]>(
    () => [
      thread.item.name,
      l10n.formatString(l10n.threadDocumentTitleUser, {
        user:
          user!.id === thread.userGiver.id
            ? thread.userReceiver.name
            : thread.userGiver.name,
      }) as string,
    ],
    [thread, user],
  );

  useDocumentTitle(documentTitle);

  return (
    <ThreadProvider value={thread}>
      <Thread />
    </ThreadProvider>
  );
};

export default ThreadLoader;
