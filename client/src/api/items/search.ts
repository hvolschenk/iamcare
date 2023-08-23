import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';
import { LocationBasic } from '~/src/types/LocationBasic';

import apiClient from '../client';

interface ItemsSearchOptions {
  distance: number;
  googlePlaceID: LocationBasic['googlePlaceID'];
  page: number;
  query: string;
}

const itemsSearch = (options: ItemsSearchOptions) => {
  const urlParameters = new URLSearchParams({
    distance: options.distance.toString(),
    location: options.googlePlaceID,
    page: options.page.toString(),
    query: options.query,
  });
  return apiClient.get<APICollectionPaginated<Item>>(
    `/items/search?${urlParameters.toString()}`,
  );
};

export default itemsSearch;
