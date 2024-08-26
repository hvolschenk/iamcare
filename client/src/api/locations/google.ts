import type { LocationBasic } from '~/src/types/LocationBasic';

import apiClient from '../client';

interface LocationByGooglePlaceIDOptions {
  googlePlaceID: LocationBasic['googlePlaceID'];
}

const locationByGooglePlaceID = (options: LocationByGooglePlaceIDOptions) =>
  apiClient.get<LocationBasic>(`/locations/google/${options.googlePlaceID}`);

export default locationByGooglePlaceID;
