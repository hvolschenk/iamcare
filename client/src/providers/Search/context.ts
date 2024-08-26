import React from 'react';

import type { Search } from './types';

const SearchContext = React.createContext<Search>({} as Search);

export default SearchContext;
