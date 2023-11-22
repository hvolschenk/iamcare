import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import threads from '~/src/api/threads/all';
import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import { root } from '~/src/urls';

import List from './List';

const Threads: React.FC = () => {
  const [page, setPage] = React.useState<number>(1);

  const { data, isError, isFetching, isLoading, refetch } = useQuery(
    ['threads', page],
    () => threads(page),
  );

  const onPageChange = React.useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
    },
    [setPage],
  );

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: l10n.threads },
        ]}
        title={l10n.threads}
      />

      {isError && (
        <Alert
          action={
            <Button
              data-testid="threads__error__retry"
              onClick={() => refetch()}
            >
              {l10n.actionTryAgain}
            </Button>
          }
          severity="error"
        >
          {l10n.threadsErrorLoading}
        </Alert>
      )}

      {!isError && isLoading && (
        <React.Fragment>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </React.Fragment>
      )}

      {!isError && !isLoading && (
        <React.Fragment>
          {data.data.meta.total === 0 && (
            <Alert data-testid="threads__error--no-items" severity="info">
              {l10n.threadsErrorNoItems}
            </Alert>
          )}

          {data.data.meta.total > 0 && (
            <React.Fragment>
              <Card>
                <CardContent>
                  <List threads={data.data.data} />
                </CardContent>
              </Card>
              <Box display="flex" justifyContent="center" marginTop={2}>
                <Pagination
                  count={data.data.meta.last_page}
                  disabled={isFetching}
                  onChange={onPageChange}
                  page={page}
                  renderItem={(item) => (
                    <PaginationItem
                      data-testid="threads__pagination__item"
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...item}
                    />
                  )}
                />
              </Box>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Threads;
