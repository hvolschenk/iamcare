import itemDelete from './delete';
import apiClient from '../client';

jest.mock('../client');

beforeEach(() => {
  (apiClient.delete as jest.Mock).mockClear();
  itemDelete('22');
});

test('Sends the correct values', () => {
  expect(apiClient.delete).toHaveBeenCalledWith('/items/22');
});
