import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import React from 'react';

import { SEARCH_DISTANCE_DEFAULT } from '~/src/constants';
import l10n from '~/src/l10n';
import { useSearch } from '~/src/providers/Search';
import { Item } from '~/src/types/Item';

interface LocationProps {
  item: Item;
}

const Location: React.FC<LocationProps> = ({ item }) => {
  const { filters, search } = useSearch();

  const onClick = React.useCallback(() => {
    search({
      filters: {
        distance: filters.distance || SEARCH_DISTANCE_DEFAULT,
        googlePlaceID: item.location.googlePlaceID,
        tagIDs: [],
      },
    });
  }, [search]);

  return (
    <Typography gutterBottom variant="subtitle1">
      {l10n.formatString(l10n.itemInLocation, {
        location: (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link
            component="button"
            data-testid="item__location"
            onClick={onClick}
          >
            {item.location.name}
          </Link>
        ),
      })}
    </Typography>
  );
};

export default Location;
