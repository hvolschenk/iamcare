import React from 'react';
import { Navigate, useLoaderData, useRouteLoaderData } from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { Item } from '~/src/types/Item';
import { User } from '~/src/types/User';
import { root, user as userURL, userItems, item as itemURL } from '~/src/urls';

import Form from './Form';

const UserItem: React.FC = () => {
  const { user: authenticatedUser } = useAuthentication();
  const item = useLoaderData() as Item;
  const user = useRouteLoaderData('user') as User;

  const documentTitle = React.useMemo<string[]>(
    () => [item.name, l10n.items, user.name],
    [item, user],
  );

  useDocumentTitle(documentTitle);

  if (authenticatedUser!.id !== item.user.id) {
    return <Navigate replace to={itemURL(item.id.toString())} />;
  }

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: user.name, url: userURL(user.id.toString()) },
          { title: l10n.items, url: userItems(user.id.toString()) },
          { title: item.name },
        ]}
        title={l10n.itemUpdatePageTitle}
      />
      <Form item={item} />
    </React.Fragment>
  );
};

export default UserItem;
