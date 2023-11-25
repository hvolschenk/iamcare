import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';

import getUser from '~/src/api/user/get';
import PageTitle from '~/src/components/PageTitle';
import l10n from '~/src/l10n';
import {
  urlLayout,
  urlRelative,
  user as userURL,
  userItems,
  UserParams,
  root,
} from '~/src/urls';

import { Provider as UserProvider } from './context';
import Items from './Items/async';
import Profile from './Profile/async';

const User: React.FC = () => {
  const { userID } = useParams<UserParams>() as UserParams;

  const { data, refetch, status } = useQuery({
    queryFn: () => getUser(parseInt(userID, 10)),
    queryKey: ['users', userID],
  });

  if (status === 'error') {
    return (
      <React.Fragment>
        <PageTitle
          breadcrumbs={[
            { title: l10n.home, url: root() },
            { title: l10n.errorLoading },
          ]}
          title={l10n.errorLoading}
        />
        <Alert
          action={
            <Button data-testid="user__error__retry" onClick={() => refetch()}>
              {l10n.actionTryAgain}
            </Button>
          }
          severity="error"
        >
          {l10n.userErrorLoading}
        </Alert>
      </React.Fragment>
    );
  }

  if (status === 'pending') {
    return (
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    );
  }

  return (
    <UserProvider value={data.data}>
      <Routes>
        <Route element={<Profile />} index />
        <Route
          element={<Items />}
          path={urlLayout(urlRelative(userItems(), userURL()))}
        />
      </Routes>
    </UserProvider>
  );
};

export default User;
