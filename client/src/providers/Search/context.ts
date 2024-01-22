import React from 'react';

import { Search } from './types';

const SearchContext = React.createContext<Search>({} as Search);

export default SearchContext;
