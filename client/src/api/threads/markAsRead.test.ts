import { faker } from '@faker-js/faker';

import apiClient from '../client';
import markAsRead from './markAsRead';

jest.mock('../client');

const id = faker.number.int();

beforeEach(() => {
  markAsRead({ id });
});

test('Calls the API client correctly', () => {
  expect(apiClient.post).toHaveBeenCalledWith(`/threads/${id}/mark-as-read`);
});
