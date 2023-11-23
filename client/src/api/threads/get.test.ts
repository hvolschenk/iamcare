import { faker } from '@faker-js/faker';

import get from './get';
import apiClient from '../client';

jest.mock('../client');

const id = faker.number.int();

beforeEach(() => {
  get({ id });
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith(`/threads/${id}`);
});
