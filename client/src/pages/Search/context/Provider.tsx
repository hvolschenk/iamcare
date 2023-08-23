import React from 'react';
import { useSearchParams } from 'react-router-dom';

import SearchContext from './context';
import { SearchFilters, SearchProviderValues } from './types';

interface SearchProviderProps {
  children: React.ReactNode;
  filters: Partial<SearchFilters>;
}

const SearchProvider: React.FC<SearchProviderProps> = ({
  children,
  filters: savedFilters,
}) => {
  const [filters, setFilters] = React.useState<SearchFilters>({
    distance: savedFilters.distance ?? '0',
    location: savedFilters.location ?? '',
    query: savedFilters.query ?? '',
  });
  const [page, setPage] = React.useState<number>(1);

  const [, setSearchParams] = useSearchParams();

  const updateQuery = React.useCallback(() => {
    setSearchParams({
      ...filters,
      page: page.toString(),
    });
  }, [filters, page, setSearchParams]);

  const setFiltersWithQueryString = React.useCallback(
    (newFilters: SearchFilters) => {
      setFilters(newFilters);
      updateQuery();
    },
    [setFilters, updateQuery],
  );

  const setPageWithQueryString = React.useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateQuery();
    },
    [setPage, updateQuery],
  );

  const providerValue = React.useMemo<SearchProviderValues>(
    () => ({
      filters,
      page,
      setFilters: setFiltersWithQueryString,
      setPage: setPageWithQueryString,
    }),
    [filters, page, setFiltersWithQueryString, setPage],
  );

  return (
    <SearchContext.Provider value={providerValue}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
