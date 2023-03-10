import { noop } from './functions';

test('noop', () => {
  expect(noop()).toBe(undefined);
});
