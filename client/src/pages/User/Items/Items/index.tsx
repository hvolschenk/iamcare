import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import React from 'react';
import { Link } from 'react-router-dom';

import PageTitle from '~/src/components/PageTitle';
import useDocumentTitle from '~/src/hooks/useDocumentTitle';
import l10n from '~/src/l10n';
import { useAuthentication } from '~/src/providers/Authentication';
import { root, user as userURL, userItemsCreate } from '~/src/urls';

import List from './List';
import { useUser } from '../../context';

const UserItemsList: React.FC = () => {
  const { user: loggedInUser } = useAuthentication();
  const { user } = useUser();

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
      <List />
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
