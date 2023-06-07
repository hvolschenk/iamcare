import { GooglePlacesProviderValues } from '../types';

export const autocomplete = jest.fn<
  Promise<google.maps.places.AutocompleteResponse>,
  [string, google.maps.places.AutocompleteSessionToken]
>();
export const generateAutocompleteSessionToken = jest.fn();

const useGooglePlaces = (): GooglePlacesProviderValues => ({
  autocomplete,
  generateAutocompleteSessionToken,
});

export default useGooglePlaces;
