import ChatIcon from '@mui/icons-material/Chat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { Item as ItemType } from '~/src/types/Item';
import { threadCreate } from '~/src/urls';

import Images from './Images';
import Tags from './Tags';

interface ItemProps {
  item: ItemType;
}

const Item: React.FC<ItemProps> = ({ item }) => {
  const { user } = useAuthentication();

  return (
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
        {user?.id !== item.user.id && (
          <CardActions>
            <Button
              color="primary"
              component={Link}
              data-testid="item__action--thread-create"
              startIcon={<ChatIcon />}
              to={threadCreate(item.id.toString())}
              variant="contained"
            >
              {l10n.itemContactGiver}
            </Button>
          </CardActions>
        )}
      </Card>
    </React.Fragment>
  );
};

export default Item;
