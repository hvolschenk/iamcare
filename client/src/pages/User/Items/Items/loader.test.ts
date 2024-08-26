import getUserItems from '~/src/api/user/getItems';
import { testUser } from '~/src/testing';
import { apiCollectionPaginated, item as itemMock } from '~/src/testing/mocks';
import type { Item } from '~/src/types/Item';
import { userItems as userItemsURL } from '~/src/urls';

import { loader } from './index';

jest.mock('~/src/api/user/getItems');

const itemsList = apiCollectionPaginated<Item>({
  data: [itemMock(), itemMock(), itemMock()],
});

describe('Without a page', () => {
  // biome-ignore lint/suspicious/noExplicitAny: The loader function is not generic
  let result: any;

  beforeEach(async () => {
    (getUserItems as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: itemsList, status: 200 });
    result = await loader({
      params: {},
      request: new Request(userItemsURL(testUser.id.toString(), {})),
    });
  });

  test('Returns the proper data', () => {
    expect(result).toEqual(itemsList);
  });
});

describe('With a page', () => {
  // biome-ignore lint/suspicious/noExplicitAny: The loader function is not generic
  let result: any;

  beforeEach(async () => {
    (getUserItems as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: itemsList, status: 200 });
    result = await loader({
      params: {},
      request: new Request(userItemsURL(testUser.id.toString(), { page: 2 })),
    });
  });

  test('Returns the proper data', () => {
    expect(result).toEqual(itemsList);
  });
});
