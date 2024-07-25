import { faker } from '@faker-js/faker';

import threadGet from '~/src/api/threads/get';
import { thread as threadMock } from '~/src/testing/mocks';

import { loader } from './index';

jest.mock('~/src/api/threads/get');

const thread = threadMock();

let result: any;

beforeEach(async () => {
  (threadGet as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: thread, status: 200 });
  result = await loader({
    params: { threadID: faker.number.int().toString() },
    request: new Request(''),
  });
});

test('Returns the proper data', () => {
  expect(result).toEqual(thread);
});
