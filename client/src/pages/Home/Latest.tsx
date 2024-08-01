import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import React from 'react';

import ItemCard from '~/src/components/ItemCard';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';

interface LatestProps {
  items: APICollectionPaginated<Item>;
}

const Latest: React.FC<LatestProps> = ({ items }) => {
  const { trackViewItemList } = useGoogleAnalytics();

  React.useEffect(() => {
    trackViewItemList({
      items: items.data,
      listIdentifier: 'latest',
      listName: 'Latest',
    });
  }, [items, trackViewItemList]);

  return (
    <React.Fragment>
      <Typography gutterBottom variant="h5">
        {l10n.homeLatestItemsTitle}
      </Typography>
      <Grid container spacing={2}>
        {items.data.map((item) => (
          <Grid item key={item.id} lg={3} md={4} xs={12}>
            <ItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
};

export default Latest;
