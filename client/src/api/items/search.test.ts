import { faker } from '@faker-js/faker';

import search from './search';
import apiClient from '../client';

jest.mock('../client');

const distance = faker.number.int();
const googlePlaceID = faker.string.uuid();
const page = faker.number.int();
const query = faker.word.sample();

beforeEach(() => {
  search({ distance, googlePlaceID, page, query });
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith(
    `/items/search?distance=${distance}&location=${googlePlaceID}&page=${page}&query=${query}`,
  );
});
