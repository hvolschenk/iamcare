import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React from 'react';

import { Item as ItemType } from '~/src/types/Item';

import Images from './Images';

interface ItemProps {
  item: ItemType;
}

const Item: React.FC<ItemProps> = ({ item }) => (
  <React.Fragment>
    <Card>
      <CardContent>
        <Images item={item} />
      </CardContent>
    </Card>
    <Typography>{item.description}</Typography>
  </React.Fragment>
);

export default Item;
