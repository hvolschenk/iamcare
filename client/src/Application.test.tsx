import React from 'react';

import { render } from '~/src/testing';

import Application from './Application';

beforeEach(() => {
  render(<Application />);
});

test('Vanity test', () => {
  expect(true).toBe(true);
});
