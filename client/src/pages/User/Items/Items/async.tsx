import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const UserItemsListLazy = React.lazy(() => import('./index'));

const UserItemsListAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <UserItemsListLazy />
  </React.Suspense>
);

export default UserItemsListAsync;
