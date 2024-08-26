import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import React from 'react';
import {
  Link,
  useNavigate,
  useRouteLoaderData,
  useSearchParams,
} from 'react-router-dom';

import ItemCard from '~/src/components/ItemCard';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import type { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import type { Item } from '~/src/types/Item';
import type { User } from '~/src/types/User';
import { userItems, userItemsCreate } from '~/src/urls';

import ListItem from './ListItem';

interface UserItemsListProps {
  items: APICollectionPaginated<Item>;
}

const UserItemsList: React.FC<UserItemsListProps> = ({ items }) => {
  const { user: loggedInUser } = useAuthentication();
  const navigate = useNavigate();
  const user = useRouteLoaderData('user') as User;
  const [searchParams] = useSearchParams();

  const isLoggedInAsOwner = React.useMemo(
    () => loggedInUser?.id === user.id,
    [loggedInUser, user],
  );

  const page = React.useMemo<number>(() => {
    const queryPage = searchParams.get('page');
    return queryPage ? Number.parseInt(queryPage, 10) : 1;
  }, [searchParams]);

  const onPageChange = React.useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      navigate(userItems(user.id.toString(), { page: newPage }));
    },
    [navigate, user],
  );

  if (items.meta.total === 0) {
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
      {isLoggedInAsOwner && (
        <Card>
          <CardContent>
            <List>
              {items.data.map((item) => (
                <ListItem item={item} key={item.id} />
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      {!isLoggedInAsOwner && (
        <Grid container spacing={2}>
          {items.data.map((item) => (
            <Grid item key={item.id} lg={3} md={4} xs={12}>
              <ItemCard item={item} />
            </Grid>
          ))}
        </Grid>
      )}
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          count={items.meta.last_page}
          onChange={onPageChange}
          page={page}
          renderItem={(item) => (
            <PaginationItem
              data-testid="user-items__pagination__item"
              {...item}
            />
          )}
        />
      </Box>
    </React.Fragment>
  );
};

export default UserItemsList;
