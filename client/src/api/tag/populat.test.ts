import popular from './popular';
import apiClient from '../client';

jest.mock('../client');

beforeEach(() => {
  popular();
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith('/tags/popular');
});
