import React from 'react';

import { render } from '~/src/testing';

import { Component } from './index';

beforeEach(() => {
  render(<Component />);
});

test('Vanity test', () => {
  expect(true).toBe(true);
});
