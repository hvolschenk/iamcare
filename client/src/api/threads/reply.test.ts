import { faker } from '@faker-js/faker';

import reply from './reply';
import apiClient from '../client';

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
