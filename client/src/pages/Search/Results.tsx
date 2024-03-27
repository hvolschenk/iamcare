import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import React from 'react';

import ItemCard from '~/src/components/ItemCard';
import l10n from '~/src/l10n';
import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';

interface ResultsProps {
  results: APICollectionPaginated<Item>;
}

const Results: React.FC<ResultsProps> = ({ results }) => {
  if (results.meta.total === 0) {
    return (
      <Alert data-testid="search__error__no-results" severity="info">
        {l10n.searchErrorNoResults}
      </Alert>
    );
  }

  return (
    <Grid container spacing={2}>
      {results.data.map((item) => (
        <Grid item key={item.id} lg={3} md={4} xs={12}>
          <ItemCard item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Results;
