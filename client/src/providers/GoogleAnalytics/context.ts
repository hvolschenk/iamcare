import React from 'react';

import type { GoogleAnalyticsProviderValues } from './types';

// Yes, this is cheating (casting `{} as GoogleAnalyticsProviderValues`).
// The value will be replaced/created before it is ever accessed, so no harm no foul I guess.
const GoogleAnalyticsContext =
  React.createContext<GoogleAnalyticsProviderValues>(
    {} as GoogleAnalyticsProviderValues,
  );

export default GoogleAnalyticsContext;
