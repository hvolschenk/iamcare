import type { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import type { Item } from '~/src/types/Item';
import type { LocationBasic } from '~/src/types/LocationBasic';

import apiClient from '../client';

interface ItemsSearchOptions {
  distance?: number;
  googlePlaceID?: LocationBasic['googlePlaceID'];
  orderBy?: 'latest';
  page: number;
  query?: string;
  tagIDs?: string[];
}

const itemsSearch = (options: ItemsSearchOptions) =>
  apiClient.get<APICollectionPaginated<Item>>('/items/search', {
    params: {
      distance: options.distance,
      location: options.googlePlaceID,
      orderBy: options.orderBy,
      page: options.page,
      query: options.query,
      tags: options.tagIDs,
    },
  });

export default itemsSearch;
