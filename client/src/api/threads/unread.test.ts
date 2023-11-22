import unread from './unread';
import apiClient from '../client';

jest.mock('../client');

beforeEach(() => {
  unread();
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith('/threads/unread');
});
