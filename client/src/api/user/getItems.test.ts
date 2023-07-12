import getUserItems from './getItems';
import client from '../client';

jest.mock('../client');

beforeEach(() => {
  (client.get as jest.Mock).mockClear();
});

describe('Without optional parameters', () => {
  beforeEach(() => {
    getUserItems(22);
  });

  test('Calls the API with the correct URL and query string', () => {
    expect(client.get).toHaveBeenCalledWith('/users/22/items?page=1');
  });
});

describe('With all parameters', () => {
  beforeEach(() => {
    getUserItems(22, 2, 20);
  });

  test('Calls the API with the correct URL and query string', () => {
    expect(client.get).toHaveBeenCalledWith(
      '/users/22/items?page=2&perPage=20',
    );
  });
});
