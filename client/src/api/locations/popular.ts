import { APICollection } from '~/src/types/APICollection';
import { LocationBasic } from '~/src/types/LocationBasic';

import apiClient from '../client';

const locationsPopular = () =>
  apiClient.get<APICollection<LocationBasic>>('/locations/popular');

export default locationsPopular;
