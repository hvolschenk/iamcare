export interface GooglePlacesProviderValues {
  autocomplete(
    query: string,
    sessionToken: google.maps.places.AutocompleteSessionToken,
  ): Promise<google.maps.places.AutocompleteResponse>;
  generateAutocompleteSessionToken(): google.maps.places.AutocompleteSessionToken;
}
