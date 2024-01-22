import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';
import { LocationBasic } from '~/src/types/LocationBasic';

import apiClient from '../client';

interface ItemsSearchOptions {
  distance?: number;
  googlePlaceID?: LocationBasic['googlePlaceID'];
  page: number;
  query?: string;
  tagIDs?: string[];
}

const itemsSearch = (options: ItemsSearchOptions) =>
  apiClient.get<APICollectionPaginated<Item>>('/items/search', {
    params: {
      distance: options.distance,
      location: options.googlePlaceID,
      page: options.page,
      query: options.query,
      tags: options.tagIDs,
    },
  });

export default itemsSearch;
