import Skeleton from '@mui/material/Skeleton';
import React from 'react';

const SearchLazy = React.lazy(() => import('./index'));

const SearchAsync: React.FC = () => (
  <React.Suspense
    fallback={
      <React.Fragment>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </React.Fragment>
    }
  >
    <SearchLazy />
  </React.Suspense>
);

export default SearchAsync;
