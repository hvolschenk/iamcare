import React from 'react';

import { SearchProviderValues } from './types';

const SearchContext = React.createContext<SearchProviderValues>(
  {} as SearchProviderValues,
);

export default SearchContext;
