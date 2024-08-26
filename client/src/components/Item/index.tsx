import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import type { Item as ItemType } from '~/src/types/Item';
import { item as itemURL } from '~/src/urls';

interface ItemProps {
  item: ItemType;
}

const Item: React.FC<ItemProps> = ({ item }) => {
  const { trackSelectItem } = useGoogleAnalytics();
  const navigate = useNavigate();

  const onGoToItem = React.useCallback(() => {
    trackSelectItem({ item });
    navigate(itemURL(item.id.toString()));
  }, [item, navigate, trackSelectItem]);

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton data-testid="item__link" onClick={onGoToItem}>
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
};

export default Item;
