import client from '../client';
import get from './get';

jest.mock('../client');

beforeEach(() => {
  (client.get as jest.Mock).mockReset();
  get(22);
});

test('Builds the URL call correctly', () => {
  expect(client.get).toHaveBeenCalledWith('/users/22');
});
