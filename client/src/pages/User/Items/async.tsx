import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const UserItemsLazy = React.lazy(() => import('./index'));

const UserItemsAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <UserItemsLazy />
  </React.Suspense>
);

export default UserItemsAsync;
