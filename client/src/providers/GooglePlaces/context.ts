import React from 'react';

import type { GooglePlacesProviderValues } from './types';

// Yes, this is cheating (casting `{} as GooglePlacesProviderValues`).
// The value will be replaced/created before it is ever accessed, so no harm no foul I guess.
const GooglePlacesContext = React.createContext<GooglePlacesProviderValues>(
  {} as GooglePlacesProviderValues,
);

export default GooglePlacesContext;
