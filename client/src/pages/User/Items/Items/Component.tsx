import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import React from 'react';
import {
  Link,
  useLoaderData,
  useRouteLoaderData,
  useSearchParams,
} from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import type { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import type { Item } from '~/src/types/Item';
import type { User } from '~/src/types/User';
import { root, userItemsCreate, user as userURL } from '~/src/urls';

import List from './List';

const UserItemsList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user: loggedInUser } = useAuthentication();
  const items = useLoaderData() as APICollectionPaginated<Item>;
  const user = useRouteLoaderData('user') as User;

  useDocumentTitle([l10n.items, user.name]);

  return (
    <React.Fragment>
      <PageTitle
        breadcrumbs={[
          { title: l10n.home, url: root() },
          { title: user.name, url: userURL(user.id.toString()) },
          { title: l10n.items },
        ]}
        title={l10n.items}
      />
      <List items={items} key={`user-items--${searchParams.get('page')}`} />
      {user.id === loggedInUser?.id && (
        <Fab
          color="secondary"
          component={Link}
          data-testid="user-items__create"
          sx={{
            bottom: (theme) => theme.spacing(2),
            position: 'fixed',
            right: (theme) => theme.spacing(2),
          }}
          to={userItemsCreate(user.id.toString())}
        >
          <AddIcon />
        </Fab>
      )}
    </React.Fragment>
  );
};

export default UserItemsList;
