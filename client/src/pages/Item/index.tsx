import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router-dom';

import itemGet from '~/src/api/items/get';
import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { ItemParams, root } from '~/src/urls';

import Item from './Item';

const ItemRoot: React.FC = () => {
  const { itemID } = useParams<ItemParams>() as ItemParams;

  const { data, refetch, status } = useQuery({
    queryFn: () => itemGet({ id: parseInt(itemID, 10) }),
    queryKey: ['items', itemID],
  });

  const documentTitle = React.useMemo<string[]>(() => {
    if (status === 'error') {
      return [l10n.itemDocumentTitleError];
    }
    if (status === 'pending') {
      return [];
    }
    return [data.data.name];
  }, [data, status]);

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
            <Button data-testid="item__error__retry" onClick={() => refetch()}>
              {l10n.actionTryAgain}
            </Button>
          }
          severity="error"
        >
          {l10n.itemErrorLoading}
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
          { title: data.data.name },
        ]}
        title={data.data.name}
      />
      <Item item={data.data} />
    </React.Fragment>
  );
};

export default ItemRoot;
