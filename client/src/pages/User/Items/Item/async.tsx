import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const UserItemsItemListLazy = React.lazy(() => import('./index'));

const UserItemsItemListAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <UserItemsItemListLazy />
  </React.Suspense>
);

export default UserItemsItemListAsync;
