// In ALL other cases `render` should be imported from `~/src/testing`.
// In this ONE case we are testing all the Providers,
// and don't need any mocks for them.
import { render } from '@testing-library/react';
import React from 'react';

import Application from './index';

// eslint-disable-next-line react/function-component-definition
jest.mock('./Bootstrap', () => () => <div />);
// eslint-disable-next-line react/function-component-definition
jest.mock('./Router', () => () => <div />);

beforeEach(() => {
  render(<Application />);
});

test('Vanity', () => {
  expect(true).toBe(true);
});
