import google from './authenticateGoogle';
import client from '../client';

jest.mock('../client');

const accessToken = 'accessToken';

beforeEach(() => {
  (client.post as jest.Mock).mockReset();
  google(accessToken);
});

test('Builds the URL call correctly', () => {
  expect(client.post).toHaveBeenCalledWith('/users/authenticate/google', {
    accessToken,
  });
});
