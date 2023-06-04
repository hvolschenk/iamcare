import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const UserLazy = React.lazy(() => import('./index'));

const UserAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <UserLazy />
  </React.Suspense>
);

export default UserAsync;
