import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React from 'react';

import { Item as ItemType } from '~/src/types/Item';

import Giver from './Giver';
import Images from './Images';
import Tags from './Tags';

interface ItemProps {
  item: ItemType;
}

const Item: React.FC<ItemProps> = ({ item }) => (
  <React.Fragment>
    <Box marginBottom={2}>
      <Images item={item} />
    </Box>
    <Card>
      <CardContent>
        <Box marginBottom={2}>
          <Tags item={item} />
        </Box>
        <Typography>{item.description}</Typography>
      </CardContent>
    </Card>
    <Giver item={item} />
  </React.Fragment>
);

export default Item;
