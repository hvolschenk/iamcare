import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const ItemsLazy = React.lazy(() => import('./index'));

const ItemsAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <ItemsLazy />
  </React.Suspense>
);

export default ItemsAsync;
