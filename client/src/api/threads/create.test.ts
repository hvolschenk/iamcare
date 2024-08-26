import { faker } from '@faker-js/faker';

import apiClient from '../client';
import create from './create';

jest.mock('../client');

const item = faker.number.int();
const message = faker.lorem.paragraph();

beforeEach(() => {
  create({ item, message });
});

test('Calls the API client correctly', () => {
  expect(apiClient.post).toHaveBeenCalledWith('/threads', { item, message });
});
