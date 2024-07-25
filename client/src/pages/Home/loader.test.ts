import itemsSearch from '~/src/api/items/search';
import locationsPopular from '~/src/api/locations/popular';
import tagsPopular from '~/src/api/tag/popular';
import {
  apiCollectionPaginated,
  item,
  locationBasic,
  tag,
} from '~/src/testing/mocks';
import { APICollection } from '~/src/types/APICollection';
import { Item } from '~/src/types/Item';
import { LocationBasic } from '~/src/types/LocationBasic';
import { Tag } from '~/src/types/Tag';

import { loader } from './index';

jest.mock('~/src/api/items/search');
jest.mock('~/src/api/locations/popular');
jest.mock('~/src/api/tag/popular');

const items = apiCollectionPaginated<Item>({
  data: [item(), item(), item()],
});
const locations: APICollection<LocationBasic> = {
  data: [locationBasic(), locationBasic(), locationBasic()],
};
const tags: APICollection<Tag> = {
  data: [tag(), tag(), tag()],
};

let result: any;

beforeEach(async () => {
  (itemsSearch as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: items, status: 200 });
  (locationsPopular as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: locations, status: 200 });
  (tagsPopular as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: tags, status: 200 });
  result = await loader({ params: {}, request: new Request('') });
});

test('Returns the proper data', () => {
  expect(result).toEqual({ items, locations, tags });
});
