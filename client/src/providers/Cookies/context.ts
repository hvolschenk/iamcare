import React from 'react';

import { CookiesProviderValues } from './types';

const CookiesContext = React.createContext<CookiesProviderValues>({
  areCookiesAccepted: false,
});

export default CookiesContext;
