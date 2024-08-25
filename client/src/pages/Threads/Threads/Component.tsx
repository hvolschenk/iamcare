import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React from 'react';
import { useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import type { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import type { Thread } from '~/src/types/Thread';
import { root, threads } from '~/src/urls';

import List from './List';

const Threads: React.FC = () => {
  useDocumentTitle([l10n.threads]);
  const data = useLoaderData() as APICollectionPaginated<Thread>;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = React.useMemo<number>(() => {
    const queryPage = searchParams.get('page');
    return queryPage ? Number.parseInt(queryPage, 10) : 1;
  }, [searchParams]);

  const onPageChange = React.useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      navigate(threads({ page: newPage }));
    },
    [navigate],
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
      <React.Fragment>
        {data.meta.total === 0 && (
          <Alert data-testid="threads__error--no-items" severity="info">
            {l10n.threadsErrorNoItems}
          </Alert>
        )}

        {data.meta.total > 0 && (
          <React.Fragment>
            <Card>
              <CardContent>
                <List threads={data.data} />
              </CardContent>
            </Card>
            <Box display="flex" justifyContent="center" marginTop={2}>
              <Pagination
                count={data.meta.last_page}
                onChange={onPageChange}
                page={page}
                renderItem={(item) => (
                  <PaginationItem
                    data-testid="threads__pagination__item"
                    {...item}
                  />
                )}
              />
            </Box>
          </React.Fragment>
        )}
      </React.Fragment>
    </React.Fragment>
  );
};

export default Threads;
