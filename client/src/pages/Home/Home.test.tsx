import React from 'react';

import { render } from '~/src/testing';

import Home from './index';

beforeEach(() => {
  render(<Home />);
});

test('Vanity test', () => {
  expect(true).toBe(true);
});
