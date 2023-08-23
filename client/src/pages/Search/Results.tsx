import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React from 'react';

import l10n from '~/src/l10n';
import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';

import { useSearch } from './context';

interface ResultsProps {
  onPageChange(event: React.ChangeEvent<unknown>, newPage: number): void;
  page: number;
  results: APICollectionPaginated<Item>;
}

const Results: React.FC<ResultsProps> = ({ onPageChange, page, results }) => {
  const { filters } = useSearch();

  if (results.meta.total === 0) {
    return (
      <Alert data-testid="search__error__no-results" severity="info">
        {l10n.formatString(l10n.searchErrorNoResults, {
          searchTerm: filters.query,
        })}
      </Alert>
    );
  }

  return (
    <React.Fragment>
      <Box marginTop={2}>
        <Card>
          <CardContent>
            <List>
              {results.data.map((item) => (
                <ListItem data-testid="search__item" key={item.id}>
                  <ListItemText
                    primary={item.name}
                    secondary={item.description}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      <Box marginTop={2}>
        <Pagination
          count={results.meta.last_page}
          onChange={onPageChange}
          page={page}
          renderItem={(item) => (
            <PaginationItem
              data-testid="search-results__pagination__item"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...item}
            />
          )}
        />
      </Box>
    </React.Fragment>
  );
};

export default Results;
