import type { APICollection } from '~/src/types/APICollection';
import type { LocationBasic } from '~/src/types/LocationBasic';

import apiClient from '../client';

const locationsPopular = () =>
  apiClient.get<APICollection<LocationBasic>>('/locations/popular');

export default locationsPopular;
