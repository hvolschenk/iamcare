import React from 'react';
import { useNavigate } from 'react-router-dom';

import ItemForm from '~/src/components/ItemForm';
import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { useNotifications } from '~/src/providers/Notifications';
import { Item } from '~/src/types/Item';
import { User } from '~/src/types/User';
import { root, user as userURL, userItems } from '~/src/urls';

const ItemCreate: React.FC = () => {
  useDocumentTitle([l10n.itemCreatePageTitle, 'MY ITEMS']);

  // In this case the user 100% exists.
  // This page is protected.
  const { user } = useAuthentication() as { user: User };
  const navigate = useNavigate();
  const { notify } = useNotifications();

  const onSuccess = React.useCallback(
    (item: Item) => {
      notify({
        message: l10n.formatString(l10n.itemCreateSuccess, {
          itemName: item.name,
        }),
      });
      navigate(userItems(user.id.toString()));
    },
    [navigate, notify, user],
  );

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: user.name, url: userURL(user.id.toString()) },
          { title: l10n.items, url: userItems(user.id.toString()) },
          { title: l10n.itemCreatePageTitle },
        ]}
        title={l10n.itemCreatePageTitle}
      />
      <ItemForm
        labelActionPrimary={l10n.itemCreateActionPrimary}
        onSuccess={onSuccess}
      />
    </React.Fragment>
  );
};

export default ItemCreate;
