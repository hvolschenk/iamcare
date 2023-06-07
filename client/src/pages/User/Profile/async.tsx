import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const UserProfileLazy = React.lazy(() => import('./index'));

const UserProfileAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <UserProfileLazy />
  </React.Suspense>
);

export default UserProfileAsync;
