import client from '../client';
import csrfToken from './csrfToken';

jest.mock('../client');

beforeEach(() => {
  (client.get as jest.Mock).mockReset();
  csrfToken();
});

test('Builds the URL call correctly', () => {
  expect(client.get).toHaveBeenCalledWith('/sanctum/csrf-cookie');
});
