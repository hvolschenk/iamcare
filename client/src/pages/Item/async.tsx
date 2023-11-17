import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const ItemLazy = React.lazy(() => import('./index'));

const ItemAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <ItemLazy />
  </React.Suspense>
);

export default ItemAsync;
