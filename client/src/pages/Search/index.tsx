import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import itemsSearch from '~/src/api/items/search';
import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useSearch } from '~/src/providers/Search';
import { root } from '~/src/urls';

import SearchForm from './Form';
import Pagination from './Pagination';
import Results from './Results';

const Search: React.FC = () => {
  const { trackViewItemList } = useGoogleAnalytics();
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

  const documentTitle = React.useMemo<string[]>(() => {
    if (query) {
      const title: string[] = [];
      if (page > 1) {
        title.push(
          l10n.formatString(l10n.searchDocumentTitlePage, { page }) as string,
        );
      }
      title.push(
        l10n.formatString(l10n.searchDocumentTitleQuery, { query }) as string,
      );
      return title;
    }
    if (filters.googlePlaceID) {
      return [l10n.searchDocumentTitleLocation];
    }
    if (filters.tagIDs?.length) {
      return [l10n.searchDocumentTitleTag];
    }
    return [l10n.search];
  }, [filters, page, query]);

  useDocumentTitle(documentTitle);

  React.useEffect(() => {
    if (status === 'success') {
      trackViewItemList({
        items: data.data.data,
        listIdentifier: 'search',
        listName: 'Search',
      });
    }
  }, [data, status, trackViewItemList]);

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
