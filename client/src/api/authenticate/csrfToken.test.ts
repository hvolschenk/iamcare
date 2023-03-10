import csrfToken from './csrfToken';
import client from '../client';

jest.mock('../client');

beforeEach(() => {
  (client.get as jest.Mock).mockReset();
  csrfToken();
});

test('Builds the URL call correctly', () => {
  expect(client.get).toHaveBeenCalledWith('/sanctum/csrf-cookie');
});
