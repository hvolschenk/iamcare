import { Loader } from '@googlemaps/js-api-loader';
import React from 'react';

import FullPageLoader from '~/src/components/FullPageLoader';
import configuration from '~/src/configuration';

import GooglePlacesContext from './context';
import { GooglePlacesProviderValues } from './types';

interface GooglePlacesProviderProps {
  children: React.ReactNode;
}

const GooglePlacesProvider: React.FC<GooglePlacesProviderProps> = ({
  children,
}) => {
  const [googlePlaces, setGooglePlaces] =
    React.useState<google.maps.PlacesLibrary | null>(null);

  React.useEffect(() => {
    const loader = new Loader({
      apiKey: configuration.google.places.apiKey(),
      libraries: ['places'],
      nonce: configuration.google.places.nonce(),
      version: 'quarterly',
    });

    loader.importLibrary('places').then((google) => {
      setGooglePlaces(google);
    });
  }, []);

  const autocomplete: GooglePlacesProviderValues['autocomplete'] =
    React.useCallback(
      (query, sessionToken) => {
        // We can assume that `googlePlaces` exists at this time.
        // The provider value is only passed down to the children (consumers) after is exists.
        const service = new googlePlaces!.AutocompleteService();
        return service.getPlacePredictions({
          componentRestrictions: {
            country: configuration.google.places.countryCode(),
          },
          input: query,
          sessionToken,
          types: ['sublocality'],
        });
      },
      [googlePlaces],
    );

  const generateAutocompleteSessionToken: GooglePlacesProviderValues['generateAutocompleteSessionToken'] =
    React.useCallback(
      // We can assume that `googlePlaces` exists at this time.
      // The provider value is only passed down to the children (consumers) after is exists.
      () => new googlePlaces!.AutocompleteSessionToken(),
      [googlePlaces],
    );

  const providerValue: GooglePlacesProviderValues = React.useMemo(
    () => ({
      autocomplete,
      generateAutocompleteSessionToken,
    }),
    [autocomplete, generateAutocompleteSessionToken],
  );

  if (googlePlaces === null) {
    return <FullPageLoader />;
  }

  return (
    <GooglePlacesContext.Provider value={providerValue}>
      {children}
    </GooglePlacesContext.Provider>
  );
};

export default GooglePlacesProvider;
