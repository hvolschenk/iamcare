import apiClient from '../client';
import all from './all';

jest.mock('../client');

describe('With no page given', () => {
  beforeEach(() => {
    (apiClient.get as jest.Mock).mockClear();
    all();
  });

  test('Calls the API client correctly', () => {
    expect(apiClient.get).toHaveBeenCalledWith('/threads?page=1');
  });
});

describe('With a page given', () => {
  beforeEach(() => {
    (apiClient.get as jest.Mock).mockClear();
    all(3);
  });

  test('Calls the API client correctly', () => {
    expect(apiClient.get).toHaveBeenCalledWith('/threads?page=3');
  });
});
