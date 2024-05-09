import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

import { useSearch } from '~/src/providers/Search';
import { getTagLabel } from '~/src/shared/tags';
import { Item } from '~/src/types/Item';
import { Tag } from '~/src/types/Tag';
import { item as itemURL } from '~/src/urls';

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const { search } = useSearch();
  const theme = useTheme();

  const onGoToTag = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, tag: Tag) => {
      event.preventDefault();
      search({ filters: { tagIDs: [tag.id] } });
    },
    [search],
  );

  return (
    <Card data-testid="search-item">
      <CardActionArea component={Link} to={itemURL(item.id.toString())}>
        <CardHeader
          avatar={
            <Avatar
              alt={item.user.name}
              slotProps={{
                img: {
                  referrerPolicy: 'no-referrer',
                },
              }}
              src={item.user.avatar}
            />
          }
          subheader={item.location.name}
          title={item.name}
        />

        <CardMedia
          alt={item.name}
          component="img"
          height={theme.spacing(20)}
          src={item.images[0].url}
        />

        <CardContent>
          <Box marginBottom={2}>
            <Stack direction="row" spacing={1}>
              {item.tags.map((tag) => (
                <Chip
                  data-testid="search-item__tag"
                  key={tag.id}
                  label={getTagLabel(tag)}
                  onClick={(event) => onGoToTag(event, tag)}
                  size="small"
                />
              ))}
            </Stack>
          </Box>
          <Typography noWrap>{item.description}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ItemCard;
