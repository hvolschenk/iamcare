import { faker } from '@faker-js/faker';

import apiClient from '../client';
import search from './search';

jest.mock('../client');

const distance = faker.number.int();
const googlePlaceID = faker.string.uuid();
const orderBy = 'latest';
const page = faker.number.int();
const query = faker.word.sample();
const tagIDs = [faker.number.int().toString(), faker.number.int().toString()];

beforeEach(() => {
  search({ distance, googlePlaceID, orderBy, page, query, tagIDs });
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith('/items/search', {
    params: {
      distance,
      location: googlePlaceID,
      orderBy,
      page,
      query,
      tags: tagIDs,
    },
  });
});
