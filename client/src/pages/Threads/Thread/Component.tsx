import React from 'react';
import { useLoaderData } from 'react-router-dom';

import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { Thread as ThreadType } from '~/src/types/Thread';

import { Provider as ThreadProvider } from './context';
import Thread from './Thread';

const ThreadLoader: React.FC = () => {
  const { user } = useAuthentication();
  const data = useLoaderData() as ThreadType;

  const documentTitle = React.useMemo<string[]>(() => {
    const thread = data;
    return [
      thread.item.name,
      l10n.formatString(l10n.threadDocumentTitleUser, {
        user:
          user!.id === thread.userGiver.id
            ? thread.userReceiver.name
            : thread.userGiver.name,
      }) as string,
    ];
  }, [data, user]);

  useDocumentTitle(documentTitle);

  return (
    <ThreadProvider value={data}>
      <Thread />
    </ThreadProvider>
  );
};

export default ThreadLoader;
