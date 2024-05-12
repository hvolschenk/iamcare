import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';

import itemGet from '~/src/api/items/get';
import Item from '~/src/components/Item';
import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { ThreadCreateParams, item, root } from '~/src/urls';

import Form from './Form';

const ThreadCreate: React.FC = () => {
  useDocumentTitle([l10n.threadCreate]);

  const { itemID } = useParams<ThreadCreateParams>() as ThreadCreateParams;
  const { data, refetch, status } = useQuery({
    queryFn: () => itemGet({ id: parseInt(itemID, 10) }),
    queryKey: ['items', itemID],
  });

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
              data-testid="thread-create__error__retry"
              onClick={() => refetch()}
            >
              {l10n.actionTryAgain}
            </Button>
          }
          severity="error"
        >
          {l10n.threadCreateErrorLoadingItem}
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
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: data.data.name, url: item(data.data.id.toString()) },
          { title: l10n.threadCreate },
        ]}
        title={l10n.threadCreate}
      />
      <Card>
        <CardContent>
          <Item item={data.data} />
          <Form item={data.data} />
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default ThreadCreate;
