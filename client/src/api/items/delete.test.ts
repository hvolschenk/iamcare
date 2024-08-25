import apiClient from '../client';
import itemDelete from './delete';

jest.mock('../client');

beforeEach(() => {
  (apiClient.delete as jest.Mock).mockClear();
  itemDelete('22');
});

test('Sends the correct values', () => {
  expect(apiClient.delete).toHaveBeenCalledWith('/items/22');
});
