import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const ThreadCreateLazy = React.lazy(() => import('./index'));

const ThreadCreateAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <ThreadCreateLazy />
  </React.Suspense>
);

export default ThreadCreateAsync;
