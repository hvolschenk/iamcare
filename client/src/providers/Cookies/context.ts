import React from 'react';

import type { CookiesProviderValues } from './types';

const CookiesContext = React.createContext<CookiesProviderValues>({
  areCookiesAccepted: false,
});

export default CookiesContext;
