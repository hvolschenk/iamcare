import userGet from '~/src/api/user/get';
import { user as userMock } from '~/src/testing/mocks';

import { loader } from './index';

jest.mock('~/src/api/user/get');

const user = userMock();

let result: any;

beforeEach(async () => {
  (userGet as jest.Mock)
    .mockClear()
    .mockResolvedValue({ data: user, status: 200 });
  result = await loader({
    params: { userID: user.id.toString() },
    request: new Request(''),
  });
});

test('Returns the proper data', () => {
  expect(result).toEqual(user);
});
