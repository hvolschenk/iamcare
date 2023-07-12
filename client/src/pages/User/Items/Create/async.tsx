import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const ItemCreateLazy = React.lazy(() => import('./index'));

const ItemCreateAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <ItemCreateLazy />
  </React.Suspense>
);

export default ItemCreateAsync;
