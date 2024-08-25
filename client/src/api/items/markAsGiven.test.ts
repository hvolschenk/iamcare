import apiClient from '../client';
import markItemAsGiven from './markAsGiven';

jest.mock('../client');

beforeEach(() => {
  (apiClient.post as jest.Mock).mockClear();
  markItemAsGiven(22);
});

test('Posts the correct values', () => {
  expect(apiClient.post).toHaveBeenCalledWith('/items/22/mark-as-given');
});
