import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const ThreadLazy = React.lazy(() => import('./index'));

const ThreadAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <ThreadLazy />
  </React.Suspense>
);

export default ThreadAsync;
