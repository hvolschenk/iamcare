import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import ItemForm from '~/src/components/ItemForm';
import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useNotifications } from '~/src/providers/Notifications';
import { Item } from '~/src/types/Item';
import { root, user as userURL, userItems } from '~/src/urls';

import { useUser } from '../../context';

const ItemCreate: React.FC = () => {
  const { user } = useUser();
  useDocumentTitle([l10n.itemCreatePageTitle, l10n.items, user.name]);

  const navigate = useNavigate();
  const { notify } = useNotifications();
  const queryClient = useQueryClient();

  const onSuccess = React.useCallback(
    (item: Item) => {
      notify({
        message: l10n.formatString(l10n.itemCreateSuccess, {
          itemName: item.name,
        }),
      });
      queryClient.invalidateQueries({ queryKey: ['users', user.id, 'items'] });
      navigate(userItems(user.id.toString()));
    },
    [navigate, notify, queryClient, user],
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
