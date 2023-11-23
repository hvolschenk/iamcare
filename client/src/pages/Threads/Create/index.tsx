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
import l10n from '~/src/l10n';
import { ThreadCreateParams, item, root } from '~/src/urls';

import Form from './Form';

const ThreadCreate: React.FC = () => {
  const { itemID } = useParams<ThreadCreateParams>() as ThreadCreateParams;
  const { data, isError, isLoading, refetch } = useQuery(
    ['items', itemID],
    () => itemGet({ id: parseInt(itemID, 10) }),
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
