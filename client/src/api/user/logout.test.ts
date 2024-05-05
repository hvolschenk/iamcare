import logout from './logout';
import client from '../client';

jest.mock('../client');

beforeEach(() => {
  (client.post as jest.Mock).mockReset();
  logout();
});

test('Builds the URL call correctly', () => {
  expect(client.post).toHaveBeenCalledWith('/users/logout');
});
