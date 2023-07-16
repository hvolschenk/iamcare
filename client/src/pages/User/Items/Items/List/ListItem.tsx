import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

import { Item } from '~/src/types/Item';

import ContextMenu from './ContextMenu';

interface ItemListItemProps {
  item: Item;
  refetch(): void;
}

const ItemListItem: React.FC<ItemListItemProps> = ({ item, refetch }) => (
  <ListItem
    data-testid="user-items__item"
    disablePadding
    secondaryAction={<ContextMenu item={item} refetch={refetch} />}
  >
    <ListItemButton>
      <ListItemAvatar>
        <Avatar alt={item.name} src={item.images[0].url} />
      </ListItemAvatar>
      <ListItemText primary={item.name} secondary={item.description} />
    </ListItemButton>
  </ListItem>
);

export default ItemListItem;
