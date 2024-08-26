import { faker } from '@faker-js/faker';

import type { LocationBasic } from '~/src/types/LocationBasic';

const locationBasic = (
  partialLocationBasic?: Partial<LocationBasic>,
): LocationBasic => ({
  address: faker.location.streetAddress(),
  dateCreated: faker.date.past().toString(),
  dateUpdated: faker.date.past().toString(),
  googlePlaceID: faker.string.uuid(),
  id: faker.number.int(),
  language: faker.helpers.arrayElement(['af', 'en', 'nl']),
  latitude: faker.location.latitude(),
  longitude: faker.location.longitude(),
  name: faker.location.city(),
  utcOffset: faker.number.int({ max: 720, min: -720 }).toString(),
  ...partialLocationBasic,
});

export default locationBasic;
