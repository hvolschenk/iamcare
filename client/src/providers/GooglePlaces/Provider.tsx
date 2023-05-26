import { Loader } from '@googlemaps/js-api-loader';
import React from 'react';

import configuration from '~/src/configuration';

import GooglePlacesContext from './context';
import { GooglePlacesProviderValues } from './types';

interface GooglePlacesProviderProps {
  children: React.ReactNode;
}

const GooglePlacesProvider: React.FC<GooglePlacesProviderProps> = ({
  children,
}) => {
  const [googleJS, setGoogleJS] = React.useState<typeof google | null>(null);

  React.useEffect(() => {
    const loader = new Loader({
      apiKey: configuration.google.places.apiKey(),
      libraries: ['places'],
      version: 'quarterly',
    });
    loader.load().then((google) => {
      setGoogleJS(google);
    });
  }, []);

  const autocomplete: GooglePlacesProviderValues['autocomplete'] =
    React.useCallback(
      (query, sessionToken) => {
        // We can assume that `googleJS` exists at this time.
        // The provider value is only passed down to the children (consumers) after is exists.
        const service = new googleJS!.maps.places.AutocompleteService();
        return service.getPlacePredictions({
          componentRestrictions: {
            country: configuration.google.places.countryCode(),
          },
          input: query,
          sessionToken,
          types: ['sublocality'],
        });
      },
      [googleJS],
    );

  const generateAutocompleteSessionToken: GooglePlacesProviderValues['generateAutocompleteSessionToken'] =
    React.useCallback(
      // We can assume that `googleJS` exists at this time.
      // The provider value is only passed down to the children (consumers) after is exists.
      () => new googleJS!.maps.places.AutocompleteSessionToken(),
      [googleJS],
    );

  const providerValue: GooglePlacesProviderValues = React.useMemo(
    () => ({
      autocomplete,
      generateAutocompleteSessionToken,
    }),
    [autocomplete, generateAutocompleteSessionToken],
  );

  if (googleJS === null) {
    return null;
  }

  return (
    <GooglePlacesContext.Provider value={providerValue}>
      {children}
    </GooglePlacesContext.Provider>
  );
};

export default GooglePlacesProvider;
