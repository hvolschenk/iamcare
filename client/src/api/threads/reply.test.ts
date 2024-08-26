import { faker } from '@faker-js/faker';

import apiClient from '../client';
import reply from './reply';

jest.mock('../client');

const id = faker.number.int();
const message = faker.lorem.paragraph();

beforeEach(() => {
  reply(id, { message });
});

test('Calls the API client correctly', () => {
  expect(apiClient.post).toHaveBeenCalledWith(`/threads/${id}/reply`, {
    message,
  });
});
