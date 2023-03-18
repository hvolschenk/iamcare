import React from 'react';

import { render } from '~/src/testing';

import Base from './Base';

beforeEach(() => {
  render(<Base />);
});

test('Vanity test', () => {
  expect(true).toBe(true);
});
