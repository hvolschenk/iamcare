import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { Link } from 'react-router-dom';

import { Item as ItemType } from '~/src/types/Item';
import { item as itemURL } from '~/src/urls';

interface ItemProps {
  item: ItemType;
}

const Item: React.FC<ItemProps> = ({ item }) => (
  <List>
    <ListItem disablePadding>
      <ListItemButton component={Link} to={itemURL(item.id.toString())}>
        <ListItemAvatar>
          <Avatar alt={item.name} src={item.images[0].url} variant="square" />
        </ListItemAvatar>
        <ListItemText
          primary={item.name}
          primaryTypographyProps={{
            sx: { textDecoration: item.isGiven ? 'line-through' : 'none' },
          }}
          secondary={item.description}
          secondaryTypographyProps={{
            sx: { textDecoration: item.isGiven ? 'line-through' : 'none' },
          }}
        />
      </ListItemButton>
    </ListItem>
  </List>
);

export default Item;
