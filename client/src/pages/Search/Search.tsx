import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import itemsSearch from '~/src/api/items/search';
import l10n from '~/src/l10n';

import { useSearch } from './context';
import Filters from './Filters';
import Results from './Results';

const SearchPage: React.FC = () => {
  const { filters, page, setPage } = useSearch();

  const { data, refetch, status } = useQuery({
    queryFn: () =>
      itemsSearch({
        distance: parseInt(filters.distance, 10),
        googlePlaceID: filters.location,
        page,
        query: filters.query,
      }),
    queryKey: ['items', 'search', filters, page],
  });

  if (status === 'error') {
    return (
      <Alert
        action={
          <Button data-testid="search__error__retry" onClick={() => refetch()}>
            {l10n.actionTryAgain}
          </Button>
        }
        severity="error"
      >
        {l10n.searchErrorLoading}
      </Alert>
    );
  }

  if (status === 'pending') {
    return (
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Filters />
      <Results
        onPageChange={(_, newPage) => setPage(newPage)}
        page={page}
        results={data.data}
      />
    </React.Fragment>
  );
};

export default SearchPage;
