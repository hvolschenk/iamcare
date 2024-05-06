import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import itemsSearch from '~/src/api/items/search';
import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { useSearch } from '~/src/providers/Search';
import { root } from '~/src/urls';

import SearchForm from './Form';
import Pagination from './Pagination';
import Results from './Results';

const Search: React.FC = () => {
  const { filters, page, query } = useSearch();

  const { data, refetch, status } = useQuery({
    queryFn: () =>
      itemsSearch({
        distance: filters.distance || 0,
        googlePlaceID: filters.googlePlaceID,
        page,
        query,
        tagIDs: filters.tagIDs?.map((tagID) => tagID.toString()),
      }),
    queryKey: ['items', 'search', { filters, page, query }],
  });

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: l10n.search },
        ]}
        title={l10n.search}
      />

      {status === 'error' && (
        <Alert
          action={
            <Button
              data-testid="search__error__retry"
              onClick={() => refetch()}
            >
              {l10n.actionTryAgain}
            </Button>
          }
          severity="error"
        >
          {l10n.searchErrorLoading}
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
        <React.Fragment>
          <SearchForm />
          <Box marginTop={2}>
            <Results results={data.data} />
          </Box>
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination meta={data.data.meta} />
          </Box>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Search;
