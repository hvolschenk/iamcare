import React from 'react';

import GooglePlacesContext from '../context';
import type { GooglePlacesProviderValues } from '../types';

interface GooglePlacesProviderProps {
  children: React.ReactNode;
}

const GooglePlacesProvider: React.FC<GooglePlacesProviderProps> = ({
  children,
}) => {
  const autocomplete = jest.fn();
  const generateAutocompleteSessionToken = jest.fn();

  const providerValue: GooglePlacesProviderValues = React.useMemo(
    () => ({
      autocomplete,
      generateAutocompleteSessionToken,
    }),
    [autocomplete, generateAutocompleteSessionToken],
  );

  return (
    <GooglePlacesContext.Provider value={providerValue}>
      {children}
    </GooglePlacesContext.Provider>
  );
};

export default GooglePlacesProvider;
