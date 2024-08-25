import apiClient from '../client';
import all from './all';

jest.mock('../client');

beforeEach(() => {
  all();
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith('/tags');
});
