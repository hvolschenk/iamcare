// In ALL other cases `render` should be imported from `~/src/testing`.
// In this ONE case we are testing all the Providers,
// and don't need any mocks for them.
import { render } from '@testing-library/react';
import React from 'react';

import Application from './Application';

jest.mock(
  './Router',
  () =>
    function Router() {
      return <div />;
    },
);

beforeEach(() => {
  render(<Application />);
});

test('Vanity test', () => {
  expect(true).toBe(true);
});
