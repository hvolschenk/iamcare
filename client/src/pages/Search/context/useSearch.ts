import React from 'react';

import SearchContext from './context';

const useSearch = () => {
  const context = React.useContext(SearchContext);
  return context;
};

export default useSearch;
