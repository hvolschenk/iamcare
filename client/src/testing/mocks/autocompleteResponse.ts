// This will only ever be used in tests,
// so importing `devDependencies` here is absolutely fine.
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker';

const autocompleteResponse = (
  partialAutocompleteResponse?: Partial<google.maps.places.AutocompleteResponse>,
): google.maps.places.AutocompleteResponse => ({
  predictions: [
    {
      description: faker.location.streetAddress(),
      matched_substrings: [
        {
          length: faker.number.int({ max: 10, min: 1 }),
          offset: faker.number.int({ max: 10, min: 1 }),
        },
      ],
      place_id: faker.string.uuid(),
      structured_formatting: {
        main_text: faker.location.street(),
        main_text_matched_substrings: [
          {
            length: faker.number.int({ max: 10, min: 1 }),
            offset: faker.number.int({ max: 10, min: 1 }),
          },
        ],
        secondary_text: faker.location.city(),
      },
      terms: [
        {
          offset: faker.number.int({ max: 10, min: 1 }),
          value: faker.location.street(),
        },
      ],
      types: ['sublocality'],
    },
    {
      description: faker.location.streetAddress(),
      matched_substrings: [
        {
          length: faker.number.int({ max: 10, min: 1 }),
          offset: faker.number.int({ max: 10, min: 1 }),
        },
      ],
      place_id: faker.string.uuid(),
      structured_formatting: {
        main_text: faker.location.street(),
        main_text_matched_substrings: [
          {
            length: faker.number.int({ max: 10, min: 1 }),
            offset: faker.number.int({ max: 10, min: 1 }),
          },
        ],
        secondary_text: faker.location.city(),
      },
      terms: [
        {
          offset: faker.number.int({ max: 10, min: 1 }),
          value: faker.location.street(),
        },
      ],
      types: ['sublocality'],
    },
    ...(partialAutocompleteResponse?.predictions || []),
  ],
});

export default autocompleteResponse;
