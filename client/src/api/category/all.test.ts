import all from './all';
import apiClient from '../client';

jest.mock('../client');

beforeEach(() => {
  all();
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith('/categories');
});
