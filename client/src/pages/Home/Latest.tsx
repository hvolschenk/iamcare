import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import itemsSearch from '~/src/api/items/search';
import ItemCard from '~/src/components/ItemCard';
import l10n from '~/src/l10n';

const Latest: React.FC = () => {
  const { data, refetch, status } = useQuery({
    queryFn: () =>
      itemsSearch({
        orderBy: 'latest',
        page: 1,
      }),
    queryKey: ['items', 'search', { orderBy: 'latest', page: 1 }],
  });

  return (
    <React.Fragment>
      <Typography gutterBottom variant="h5">
        {l10n.homeLatestItemsTitle}
      </Typography>
      {status === 'error' && (
        <Alert
          action={
            <Button
              data-testid="home__latest__error__retry"
              onClick={() => refetch()}
            >
              {l10n.actionTryAgain}
            </Button>
          }
          severity="error"
        >
          {l10n.homeLatestItemsErrorLoading}
        </Alert>
      )}
      {status === 'pending' && (
        <React.Fragment>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </React.Fragment>
      )}
      {status === 'success' && (
        <Grid container spacing={2}>
          {data.data.data.map((item) => (
            <Grid item key={item.id} lg={3} md={4} xs={12}>
              <ItemCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
    </React.Fragment>
  );
};

export default Latest;
