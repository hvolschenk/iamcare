import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import React from 'react';

import { SEARCH_DISTANCE_DEFAULT } from '~/src/constants';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useSearch } from '~/src/providers/Search';
import type { APICollection } from '~/src/types/APICollection';
import type { LocationBasic } from '~/src/types/LocationBasic';

interface LocationsProps {
  locations: APICollection<LocationBasic>;
}

const Locations: React.FC<LocationsProps> = ({ locations }) => {
  const { trackSelectContent } = useGoogleAnalytics();
  const { search } = useSearch();

  const onLocationClick = React.useCallback(
    (location: LocationBasic) => {
      trackSelectContent({
        identifier: location.googlePlaceID,
        type: 'location',
      });
      search({
        filters: {
          distance: SEARCH_DISTANCE_DEFAULT,
          googlePlaceID: location.googlePlaceID,
          tagIDs: [],
        },
      });
    },
    [search, trackSelectContent],
  );

  return (
    <Card>
      <CardHeader title={l10n.homeLocationsTitle} />
      <CardContent>
        <Grid container spacing={2}>
          {locations.data.map((location) => (
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
      </CardContent>
    </Card>
  );
};

export default Locations;
