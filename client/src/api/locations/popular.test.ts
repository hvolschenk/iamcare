import apiClient from '../client';
import popular from './popular';

jest.mock('../client');

beforeEach(() => {
  popular();
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith('/locations/popular');
});
