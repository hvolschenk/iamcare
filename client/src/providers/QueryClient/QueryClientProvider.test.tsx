// In ALL other cases `render` should be imported from `~/src/testing`.
// In this ONE case we are testing this Provider in isolation,
// and don't need any mocks for it.
import { render, RenderResult } from '@testing-library/react';
import React from 'react';

import QueryClientProvider from './Provider';

jest.mock('@tanstack/react-query-devtools', () => {
  const ReactQueryDevtools: React.FC = () => <div data-testid="devtools" />;
  return { ReactQueryDevtools };
});

describe('Without devtools', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    process.env.QUERY_DEVTOOLS_VISIBLE = 'false';
    wrapper = render(
      <QueryClientProvider queryClientConfig={{}}>
        <div data-testid="children" />
      </QueryClientProvider>,
    );
  });

  test('Does not render the devtools', () => {
    expect(wrapper.queryByTestId('devtools')).not.toBeInTheDocument();
  });
});

describe('With devtools', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    process.env.QUERY_DEVTOOLS_VISIBLE = 'true';
    wrapper = render(
      <QueryClientProvider>
        <div data-testid="children" />
      </QueryClientProvider>,
    );
  });

  test('Renders the devtools', () => {
    expect(wrapper.queryByTestId('devtools')).toBeInTheDocument();
  });
});
