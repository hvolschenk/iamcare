import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const ThreadsLazy = React.lazy(() => import('./index'));

const ThreadsAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <ThreadsLazy />
  </React.Suspense>
);

export default ThreadsAsync;
