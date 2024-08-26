import MapIcon from '@mui/icons-material/Map';
import PlaceIcon from '@mui/icons-material/Place';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import React from 'react';

import LocationMapDialog from '~/src/components/LocationMapDialog';
import { SEARCH_DISTANCE_DEFAULT } from '~/src/constants';
import { useSearch } from '~/src/providers/Search';
import type { Item } from '~/src/types/Item';

interface LocationProps {
  item: Item;
}

const Location: React.FC<LocationProps> = ({ item }) => {
  const [isMapOpen, setIsMapOpen] = React.useState<boolean>(false);

  const { filters, search } = useSearch();

  const onMapClose = React.useCallback(() => {
    setIsMapOpen(false);
  }, []);
  const onMapOpen = React.useCallback(() => {
    setIsMapOpen(true);
  }, []);

  const onSearchByLocation = React.useCallback(() => {
    search({
      filters: {
        distance: filters.distance || SEARCH_DISTANCE_DEFAULT,
        googlePlaceID: item.location.googlePlaceID,
        tagIDs: [],
      },
    });
  }, [filters, item, search]);

  return (
    <Box marginBottom={3}>
      <ButtonGroup size="small" variant="contained">
        <Button
          data-testid="item__location"
          onClick={onSearchByLocation}
          startIcon={<PlaceIcon />}
        >
          {item.location.name}
        </Button>
        <Button data-testid="item__location--map" onClick={onMapOpen}>
          <MapIcon />
        </Button>
      </ButtonGroup>
      <LocationMapDialog
        isOpen={isMapOpen}
        location={item.location}
        onClose={onMapClose}
      />
    </Box>
  );
};

export default Location;
