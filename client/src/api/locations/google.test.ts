import { faker } from '@faker-js/faker';

import apiClient from '../client';
import google from './google';

jest.mock('../client');

const googlePlaceID = faker.string.uuid();

beforeEach(() => {
  google({ googlePlaceID });
});

test('Calls the API client correctly', () => {
  expect(apiClient.get).toHaveBeenCalledWith(
    `/locations/google/${googlePlaceID}`,
  );
});
