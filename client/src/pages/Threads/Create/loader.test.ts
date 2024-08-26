import { faker } from '@faker-js/faker';

import itemGet from '~/src/api/items/get';
import { item as itemMock } from '~/src/testing/mocks';

import { loader } from './index';

jest.mock('~/src/api/items/get');

const item = itemMock();

// biome-ignore lint/suspicious/noExplicitAny: The loader functions are not generic
let result: any;

beforeEach(async () => {
  (itemGet as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: item, status: 200 });
  result = await loader({
    params: { itemID: faker.number.int().toString() },
    request: new Request(''),
  });
});

test('Returns the proper data', () => {
  expect(result).toEqual(item);
});
