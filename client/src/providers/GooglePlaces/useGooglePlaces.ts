import React from 'react';

import GooglePlacesContext from './context';

const useGooglePlaces = () => {
  const context = React.useContext(GooglePlacesContext);
  return context;
};

export default useGooglePlaces;
