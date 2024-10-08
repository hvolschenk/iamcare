import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';

import ItemForm from '~/src/components/ItemForm';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useNotifications } from '~/src/providers/Notifications';
import type { Item } from '~/src/types/Item';
import type { User } from '~/src/types/User';
import { userItems } from '~/src/urls';

interface UserItemFormProps {
  item: Item;
}

const UserItemForm: React.FC<UserItemFormProps> = ({ item }) => {
  const user = useRouteLoaderData('user') as User;

  const { trackCustomEvent } = useGoogleAnalytics();
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const queryClient = useQueryClient();

  const onSuccess = React.useCallback(
    (newItem: Item) => {
      trackCustomEvent(
        { action: 'update_item', category: 'items' },
        { itemID: item.id },
      );
      notify({
        message: l10n.formatString(l10n.itemCreateSuccess, {
          itemName: newItem.name,
        }),
      });
      queryClient.invalidateQueries({ queryKey: ['users', user.id, 'items'] });
      navigate(userItems(user.id.toString()));
    },
    [item, navigate, notify, queryClient, trackCustomEvent, user],
  );

  return (
    <ItemForm
      item={item}
      labelActionPrimary={l10n.itemUpdateActionPrimary}
      onSuccess={onSuccess}
    />
  );
};

export default UserItemForm;
