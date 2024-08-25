import MUIPagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React from 'react';

import { useSearch } from '~/src/providers/Search';
import type { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import type { Item } from '~/src/types/Item';

interface PaginationProps {
  meta: APICollectionPaginated<Item>['meta'];
}

const Pagination: React.FC<PaginationProps> = ({ meta }) => {
  const { filters, query, page, search } = useSearch();

  const onPageChange = React.useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      search({ filters, page: newPage, query });
    },
    [filters, query, search],
  );

  return (
    <MUIPagination
      count={meta.last_page}
      onChange={onPageChange}
      page={page}
      renderItem={(item) => (
        <PaginationItem
          data-testid="search-results__pagination__item"
          {...item}
        />
      )}
    />
  );
};

export default Pagination;
