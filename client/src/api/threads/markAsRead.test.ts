import { faker } from '@faker-js/faker';

import markAsRead from './markAsRead';
import apiClient from '../client';

jest.mock('../client');

const id = faker.number.int();

beforeEach(() => {
  markAsRead({ id });
});

test('Calls the API client correctly', () => {
  expect(apiClient.post).toHaveBeenCalledWith(`/threads/${id}/mark-as-read`);
});
