import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';

import getUserItems from '~/src/api/user/getItems';
import ItemCard from '~/src/components/ItemCard';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { userItemsCreate } from '~/src/urls';

import ListItem from './ListItem';
import { useUser } from '../../../context';

const UserItemsList: React.FC = () => {
  const [page, setPage] = React.useState<number>(1);

  const { user: loggedInUser } = useAuthentication();
  const { user } = useUser();

  const { data, isFetching, isRefetching, refetch, status } = useQuery({
    placeholderData: keepPreviousData,
    queryFn: () => getUserItems(user.id, page),
    queryKey: ['users', user.id, 'items', page],
  });

  const isLoggedInAsOwner = React.useMemo(
    () => loggedInUser?.id === user.id,
    [loggedInUser, user],
  );

  const onPageChange = React.useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      setPage(newPage);
    },
    [setPage],
  );

  if (status === 'pending') {
    return (
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    );
  }

  if (status === 'error') {
    return (
      <Alert
        action={
          <Button
            data-testid="user-items__error--loading__retry"
            onClick={() => refetch()}
          >
            {l10n.actionTryAgain}
          </Button>
        }
        severity="error"
      >
        {l10n.userItemsErrorLoading}
      </Alert>
    );
  }

  if (data.data.meta.total === 0) {
    return (
      <Alert
        action={
          isLoggedInAsOwner ? (
            <Button
              color="inherit"
              component={Link}
              data-testid="user-items__error--no-items__create"
              to={userItemsCreate(loggedInUser!.id.toString())}
            >
              {l10n.userItemsCreateNew}
            </Button>
          ) : undefined
        }
        data-testid="user-items__error--no-items"
        severity="info"
      >
        {isLoggedInAsOwner
          ? l10n.userItemsErrorNoItemsSelf
          : l10n.userItemsErrorNoItems}
      </Alert>
    );
  }

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
        open={isRefetching}
      >
        <Alert
          icon={<CircularProgress color="inherit" size="1em" />}
          severity="info"
        >
          {l10n.itemsRefetching}
        </Alert>
      </Snackbar>
      {isLoggedInAsOwner && (
        <Card>
          <CardContent>
            <List>
              {data.data.data.map((item) => (
                <ListItem item={item} key={item.id} />
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      {!isLoggedInAsOwner && (
        <Grid container spacing={2}>
          {data.data.data.map((item) => (
            <Grid item key={item.id} lg={3} md={4} xs={12}>
              <ItemCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          count={data.data.meta.last_page}
          disabled={isFetching}
          onChange={onPageChange}
          page={page}
          renderItem={(item) => (
            <PaginationItem
              data-testid="user-items__pagination__item"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...item}
            />
          )}
        />
      </Box>
    </React.Fragment>
  );
};

export default UserItemsList;
