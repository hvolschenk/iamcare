import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import ItemForm from '~/src/components/ItemForm';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useNotifications } from '~/src/providers/Notifications';
import { Item } from '~/src/types/Item';
import { userItems } from '~/src/urls';

import { useUser } from '../../context';

interface UserItemFormProps {
  item: Item;
}

const UserItemForm: React.FC<UserItemFormProps> = ({ item }) => {
  const { user } = useUser();

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
    [navigate, notify, queryClient, trackCustomEvent, user],
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
