import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';

import threadGet from '~/src/api/threads/get';
import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { ThreadParams, root } from '~/src/urls';

import { Provider as ThreadProvider } from './context';
import Thread from './Thread';

const ThreadLoader: React.FC = () => {
  const { threadID } = useParams<ThreadParams>() as ThreadParams;

  const { data, isError, isLoading, refetch } = useQuery(
    ['threads', threadID],
    () => threadGet({ id: parseInt(threadID, 10) }),
  );

  if (isError) {
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

  if (isLoading) {
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
