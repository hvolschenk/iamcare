import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const HomeLazy = React.lazy(() => import('./index'));

const HomeAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <HomeLazy />
  </React.Suspense>
);

export default HomeAsync;
