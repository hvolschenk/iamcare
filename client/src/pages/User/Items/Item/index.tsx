import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import itemGet from '~/src/api/items/get';
import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import {
  root,
  user as userURL,
  userItems,
  UserItemParams,
  item,
} from '~/src/urls';

import Form from './Form';
import { useUser } from '../../context';

const UserItem: React.FC = () => {
  const { user: authenticatedUser } = useAuthentication();
  const { itemID } = useParams<UserItemParams>() as UserItemParams;
  const { user } = useUser();

  const { data, status, refetch } = useQuery({
    queryFn: () => itemGet({ id: parseInt(itemID, 10) }),
    queryKey: ['item', itemID],
  });

  if (status === 'error') {
    return (
      <React.Fragment>
        <PageTitle
          breadcrumbs={[
            { title: l10n.home, url: root() },
            { title: user.name, url: userURL(user.id.toString()) },
            { title: l10n.items, url: userItems(user.id.toString()) },
            { title: l10n.errorLoading },
          ]}
          title={l10n.errorLoading}
        />
        <Alert
          action={
            <Button
              data-testid="user-items__item__error--loading"
              onClick={() => refetch()}
            >
              {l10n.actionTryAgain}
            </Button>
          }
          severity="error"
        >
          {l10n.itemUpdateErrorLoading}
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

  if (authenticatedUser!.id !== data.data.user.id) {
    return <Navigate replace to={item(data.data.id.toString())} />;
  }

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: user.name, url: userURL(user.id.toString()) },
          { title: l10n.items, url: userItems(user.id.toString()) },
          { title: data.data.name },
        ]}
        title={l10n.itemUpdatePageTitle}
      />
      <Form item={data.data} />
    </React.Fragment>
  );
};

export default UserItem;
