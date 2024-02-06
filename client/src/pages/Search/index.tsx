import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import itemsSearch from '~/src/api/items/search';
import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { useSearch } from '~/src/providers/Search';
import { root } from '~/src/urls';

import Filters from './Filters';
import Pagination from './Pagination';
import Results from './Results';

const Search: React.FC = () => {
  const { filters, hasFilter, page, query } = useSearch();

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
          <Accordion>
            <AccordionSummary
              data-testid="search__filters__summary"
              expandIcon={<ExpandMoreIcon />}
            >
              <Stack alignItems="center" direction="row" gap={1}>
                <Badge color="secondary" invisible={!hasFilter} variant="dot">
                  <TuneIcon />
                </Badge>
                <Typography>{l10n.searchFilters}</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Filters />
            </AccordionDetails>
          </Accordion>

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
