import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import React from 'react';
import { Link } from 'react-router-dom';

import { Item } from '~/src/types/Item';
import { userItemsItem } from '~/src/urls';

import ContextMenu from './ContextMenu';

interface ItemListItemProps {
  item: Item;
}

const ItemListItem: React.FC<ItemListItemProps> = ({ item }) => (
  <ListItem
    data-testid="user-items__item"
    disablePadding
    secondaryAction={<ContextMenu item={item} />}
  >
    <ListItemButton
      component={Link}
      data-testid="user-items__item__link"
      to={userItemsItem(item.user.id.toString(), item.id.toString())}
    >
      <ListItemAvatar>
        <Avatar alt={item.name} src={item.images[0].url} />
      </ListItemAvatar>
      <ListItemText
        primary={item.name}
        secondary={
          <React.Fragment>
            {item.description}
            <Stack component="span" direction="row" spacing={2}>
              {item.tags.map((tag) => (
                <Chip
                  component="span"
                  key={tag.id}
                  label={tag.title}
                  size="small"
                />
              ))}
            </Stack>
          </React.Fragment>
        }
      />
    </ListItemButton>
  </ListItem>
);

export default ItemListItem;
