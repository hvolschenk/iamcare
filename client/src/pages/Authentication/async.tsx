import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const AuthenticationLazy = React.lazy(() => import('./index'));

const AuthenticationAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <AuthenticationLazy />
  </React.Suspense>
);

export default AuthenticationAsync;
