import Box from '@mui/material/Box';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { useSearch } from '~/src/providers/Search';
import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';
import { root } from '~/src/urls';

import SearchForm from './Form';
import Pagination from './Pagination';
import Results from './Results';

const Search: React.FC = () => {
  const { trackViewItemList } = useGoogleAnalytics();
  const items = useLoaderData() as APICollectionPaginated<Item>;
  const { filters, page, query } = useSearch();

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
    if (filters.tagIDs.length) {
      return [l10n.searchDocumentTitleTag];
    }
    return [l10n.search];
  }, [filters, page, query]);

  useDocumentTitle(documentTitle);

  React.useEffect(() => {
    trackViewItemList({
      items: items.data,
      listIdentifier: 'search',
      listName: 'Search',
    });
  }, [items, trackViewItemList]);

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: l10n.search },
        ]}
        title={l10n.search}
      />
      <SearchForm />
      <Box marginTop={2}>
        <Results results={items} />
      </Box>
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination meta={items.meta} />
      </Box>
    </React.Fragment>
  );
};

export default Search;
