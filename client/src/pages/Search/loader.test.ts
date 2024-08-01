import { faker } from '@faker-js/faker';

import itemsSearch from '~/src/api/items/search';
import { apiCollectionPaginated, item } from '~/src/testing/mocks';
import { Item } from '~/src/types/Item';
import { itemsSearch as itemsSearchURL } from '~/src/urls';

import { loader } from './index';

jest.mock('~/src/api/items/search');

describe('Without tags', () => {
  const items = apiCollectionPaginated<Item>({
    data: [item(), item(), item()],
  });

  let result: any;

  beforeEach(async () => {
    (itemsSearch as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: items, status: 200 });
    result = await loader({
      params: {},
      request: new Request(itemsSearchURL({ query: faker.word.sample() })),
    });
  });

  test('Returns the proper data', () => {
    expect(result).toEqual(items);
  });
});

describe('With tags', () => {
  const items = apiCollectionPaginated<Item>({
    data: [item(), item(), item()],
  });

  let result: any;

  beforeEach(async () => {
    (itemsSearch as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: items, status: 200 });
    result = await loader({
      params: {},
      request: new Request(
        itemsSearchURL({
          query: faker.word.sample(),
          tag: [faker.number.int(), faker.number.int()],
        }),
      ),
    });
  });

  test('Returns the proper data', () => {
    expect(result).toEqual(items);
  });
});
