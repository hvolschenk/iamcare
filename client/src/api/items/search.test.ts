import { faker } from '@faker-js/faker';

import search from './search';
import apiClient from '../client';

jest.mock('../client');

const distance = faker.number.int();
const googlePlaceID = faker.string.uuid();
const page = faker.number.int();
const query = faker.word.sample();
const tagIDs = [faker.number.int().toString(), faker.number.int().toString()];

beforeEach(() => {
  search({ distance, googlePlaceID, page, query, tagIDs });
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith('/items/search', {
    params: { distance, location: googlePlaceID, page, query, tags: tagIDs },
  });
});
