import { authentication, root, urlLayout, urlRelative } from './urls';

test('authentication', () => {
  expect(authentication()).toBe('/authentication');
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
