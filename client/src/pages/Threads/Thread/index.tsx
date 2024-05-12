import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';

import threadGet from '~/src/api/threads/get';
import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { ThreadParams, root } from '~/src/urls';

import { Provider as ThreadProvider } from './context';
import Thread from './Thread';

const ThreadLoader: React.FC = () => {
  const { user } = useAuthentication();
  const { threadID } = useParams<ThreadParams>() as ThreadParams;

  const { data, refetch, status } = useQuery({
    queryFn: () => threadGet({ id: parseInt(threadID, 10) }),
    queryKey: ['threads', parseInt(threadID, 10)],
  });

  const documentTitle = React.useMemo<string[]>(() => {
    if (status === 'error') {
      return [l10n.threadDocumentTitleError];
    }
    if (status === 'pending') {
      return [];
    }
    const thread = data.data;
    return [
      thread.item.name,
      l10n.formatString(l10n.threadDocumentTitleUser, {
        user:
          user!.id === thread.userGiver.id
            ? thread.userReceiver.name
            : thread.userGiver.name,
      }) as string,
    ];
  }, [data, status, user]);

  useDocumentTitle(documentTitle);

  if (status === 'error') {
    return (
      <React.Fragment>
        <PageTitle
          breadcrumbs={[
            { title: l10n.home, url: root() },
            { title: l10n.errorLoading },
          ]}
          title={l10n.errorLoading}
        />
        <Alert
          action={
            <Button
              data-testid="thread__error__retry"
              onClick={() => refetch()}
            >
              {l10n.actionTryAgain}
            </Button>
          }
          severity="error"
        >
          {l10n.threadErrorLoading}
        </Alert>
      </React.Fragment>
    );
  }

  if (status === 'pending') {
    return (
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    );
  }

  return (
    <ThreadProvider value={data.data}>
      <Thread />
    </ThreadProvider>
  );
};

export default ThreadLoader;
