import { faker } from '@faker-js/faker';

import create from './create';
import apiClient from '../client';

jest.mock('../client');

const item = faker.number.int();
const message = faker.lorem.paragraph();

beforeEach(() => {
  create({ item, message });
});

test('Calls the API client correctly', () => {
  expect(apiClient.post).toHaveBeenCalledWith('/threads', { item, message });
});
