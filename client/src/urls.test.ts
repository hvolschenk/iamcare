import { faker } from '@faker-js/faker';

import {
  authentication,
  itemsSearch,
  root,
  urlLayout,
  urlRelative,
} from './urls';

test('authentication', () => {
  expect(authentication()).toBe('/authentication');
});

describe('itemsSearch', () => {
  test('With no parameters', () => {
    expect(itemsSearch()).toBe('/items/search?');
  });

  test('With all parameters', () => {
    const distance = faker.number.int();
    const location = faker.string.uuid();
    const page = faker.number.int();
    const perPage = faker.number.int();
    const query = faker.word.sample();
    const options = { distance, location, page, perPage, query };
    expect(itemsSearch(options)).toBe(
      `/items/search?distance=${distance.toString()}&location=${location}&page=${page.toString()}&perPage=${perPage.toString()}&query=${query}`,
    );
  });
});

test('root', () => {
  expect(root()).toBe('/');
});

describe('urlLayout', () => {
  test('Adds a * at the end of the URL', () => {
    expect(urlLayout('/one/two')).toBe('/one/two/*');
  });
});

describe('urlRelative', () => {
  test('Removes the parent section from the URL', () => {
    expect(urlRelative('/one/two', '/one')).toBe('/two');
  });
});
