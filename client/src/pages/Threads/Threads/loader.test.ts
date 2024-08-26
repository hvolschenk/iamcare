import threads from '~/src/api/threads/all';
import {
  apiCollectionPaginated,
  thread as threadMock,
} from '~/src/testing/mocks';
import type { Thread } from '~/src/types/Thread';
import { threads as threadsURL } from '~/src/urls';

import { loader } from './index';

jest.mock('~/src/api/threads/all');

const threadsList = apiCollectionPaginated<Thread>({
  data: [threadMock(), threadMock(), threadMock()],
});

describe('Without a page', () => {
  // biome-ignore lint/suspicious/noExplicitAny: The loader functions are not generic
  let result: any;

  beforeEach(async () => {
    (threads as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: threadsList, status: 200 });
    result = await loader({
      params: {},
      request: new Request(threadsURL({})),
    });
  });

  test('Returns the proper data', () => {
    expect(result).toEqual(threadsList);
  });
});

describe('With a page', () => {
  // biome-ignore lint/suspicious/noExplicitAny: The loader function is not generic
  let result: any;

  beforeEach(async () => {
    (threads as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: threadsList, status: 200 });
    result = await loader({
      params: {},
      request: new Request(threadsURL({ page: 2 })),
    });
  });

  test('Returns the proper data', () => {
    expect(result).toEqual(threadsList);
  });
});
