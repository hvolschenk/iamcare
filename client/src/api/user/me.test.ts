import client from '../client';
import me from './me';

jest.mock('../client');

beforeEach(() => {
  (client.get as jest.Mock).mockReset();
  me();
});

test('Builds the URL call correctly', () => {
  expect(client.get).toHaveBeenCalledWith('/users/me');
});
