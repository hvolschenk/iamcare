import itemDelete from './delete';
import apiClient from '../client';

jest.mock('../client');

beforeEach(() => {
  (apiClient.post as jest.Mock).mockClear();
  itemDelete('22');
});

test('Posts the correct values', () => {
  expect(apiClient.delete).toHaveBeenCalledWith('/items/22');
});
