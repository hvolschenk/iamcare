import apiClient from '../client';
import unread from './unread';

jest.mock('../client');

beforeEach(() => {
  unread();
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith('/threads/unread');
});
