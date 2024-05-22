import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import locationsPopular from '~/src/api/locations/popular';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useSearch } from '~/src/providers/Search';
import { LocationBasic } from '~/src/types/LocationBasic';

const Locations: React.FC = () => {
  const { trackSelectContent } = useGoogleAnalytics();
  const { search } = useSearch();

  const { data, refetch, status } = useQuery({
    queryFn: locationsPopular,
    queryKey: ['locations', 'popular'],
  });

  const onLocationClick = React.useCallback(
    (location: LocationBasic) => {
      trackSelectContent({
        identifier: location.googlePlaceID,
        type: 'location',
      });
      search({
        filters: { distance: 25, googlePlaceID: location.googlePlaceID },
      });
    },
    [search, trackSelectContent],
  );

  return (
    <Card>
      <CardHeader title={l10n.homeLocationsTitle} />
      <CardContent>
        {status === 'error' && (
          <Alert
            action={
              <Button
                data-testid="home__locations__error__retry"
                onClick={() => refetch()}
              >
                {l10n.actionTryAgain}
              </Button>
            }
            severity="error"
          >
            {l10n.homeLocationsErrorLoading}
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
            {data.data.data.map((location) => (
              <Grid item key={location.id} lg={4} md={6} xs={12}>
                <ListItem component="div" disablePadding>
                  <ListItemButton
                    component="div"
                    data-testid="home__locations__location"
                    onClick={() => onLocationClick(location)}
                  >
                    <ListItemText
                      primary={
                        <Stack direction="row" gap={1} justifyItems="center">
                          {location.name}
                          <Chip label={location.itemsCount} size="small" />
                        </Stack>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default Locations;
