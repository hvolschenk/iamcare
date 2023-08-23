import { faker } from '@faker-js/faker';

import google from './google';
import apiClient from '../client';

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
