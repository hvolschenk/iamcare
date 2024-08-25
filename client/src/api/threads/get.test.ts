import { faker } from '@faker-js/faker';

import apiClient from '../client';
import get from './get';

jest.mock('../client');

const id = faker.number.int();

beforeEach(() => {
  get({ id });
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith(`/threads/${id}`);
});
