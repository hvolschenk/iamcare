import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import { ItemsSearchOptions, itemsSearch } from '~/src/urls';

import SearchContext from './context';
import SearchDialog from './SearchDialog';
import { Search, SearchFilters } from './types';

interface SearchProviderProps {
  children: React.ReactNode;
}

const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [filters, setFilters] = React.useState<SearchFilters>({});
  const [isSearchDialogOpen, setIsSearchDialogOpen] =
    React.useState<boolean>(false);
  const [page, setPage] = React.useState<number>(1);
  const [query, setQuery] = React.useState<string | undefined>(undefined);

  const { trackSearch } = useGoogleAnalytics();
  const navigate = useNavigate();
  const [urlSearchParams] = useSearchParams();

  React.useEffect(() => {
    const newFilters: SearchFilters = {};
    let newPage: number = page;
    let newQuery: string | undefined;
    const pageSearchParameter = urlSearchParams.get('page');
    if (pageSearchParameter) {
      newPage = parseInt(pageSearchParameter, 10);
    }
    const querySearchParameter = urlSearchParams.get('query');
    if (querySearchParameter) {
      newQuery = querySearchParameter;
    }
    const distance = urlSearchParams.get('distance');
    const googlePlaceID = urlSearchParams.get('googlePlaceID');
    if (googlePlaceID) {
      newFilters.googlePlaceID = googlePlaceID;
      if (distance) {
        newFilters.distance = parseInt(distance, 10);
      }
    }
    const tagIDs = urlSearchParams.getAll('tag');
    if (tagIDs) {
      newFilters.tagIDs = tagIDs.map((tagID) => parseInt(tagID, 10));
    }
    setFilters(newFilters);
    setPage(newPage);
    setQuery(newQuery);
  }, [page, setFilters, setPage, setQuery, urlSearchParams]);

  const hasFilter = React.useMemo<boolean>(
    () =>
      Boolean(filters.distance) ||
      Boolean(filters.googlePlaceID) ||
      Boolean(filters.tagIDs?.length),
    [filters],
  );

  const hasQuery = React.useMemo<boolean>(() => Boolean(query), [query]);

  const search: Search['search'] = React.useCallback(
    (options) => {
      trackSearch({ filters: options.filters, query: options.query });
      const itemsSearchOptions: ItemsSearchOptions = {};
      if (options.page) {
        itemsSearchOptions.page = options.page;
      }
      if (options.query) {
        itemsSearchOptions.query = options.query;
      }
      const { distance, googlePlaceID } = filters;
      if (options.filters?.googlePlaceID || googlePlaceID) {
        itemsSearchOptions.location =
          options.filters?.googlePlaceID || googlePlaceID;
        if (options.filters?.distance || distance) {
          itemsSearchOptions.distance = options.filters?.distance || distance;
        }
      }
      if (options.filters?.tagIDs) {
        itemsSearchOptions.tag = options.filters.tagIDs;
      }
      navigate(itemsSearch(itemsSearchOptions));
    },
    [filters, navigate],
  );

  const searchDialogClose = React.useCallback(() => {
    setIsSearchDialogOpen(false);
  }, [setIsSearchDialogOpen]);
  const searchDialogOpen = React.useCallback(() => {
    setIsSearchDialogOpen(true);
  }, [setIsSearchDialogOpen]);

  const providerValue = React.useMemo<Search>(
    () => ({
      filters,
      hasFilter,
      hasQuery,
      page,
      query,
      search,
      searchDialogOpen,
    }),
    [filters, hasFilter, hasQuery, page, query, search, searchDialogOpen],
  );

  return (
    <SearchContext.Provider value={providerValue}>
      {children}
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={searchDialogClose}
        onSearch={search}
        query={query}
      />
    </SearchContext.Provider>
  );
};

export default SearchProvider;
