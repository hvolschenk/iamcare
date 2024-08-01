// In ALL other cases `render` should be imported from `~/src/testing`.
// In this ONE case we are testing this Provider in isolation,
// and don't need any mocks for it.
import { QueryClient, useQuery } from '@tanstack/react-query';
import { render, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';
import ReactGA from 'react-ga4';

import { Provider as GoogleAnalyticsProvider } from '~/src/providers/GoogleAnalytics';

import QueryClientProvider, { queryClient } from './Provider';

jest.mock('@tanstack/react-query-devtools', () => {
  const ReactQueryDevtools: React.FC = () => <div data-testid="devtools" />;
  return { ReactQueryDevtools };
});
jest.mock('react-ga4');
jest.unmock('~/src/providers/QueryClient/Provider');

const queryFail = jest.fn().mockRejectedValue(new Error('Failed to query'));

const TestComponentFail: React.FC = () => {
  const query = useQuery(
    {
      queryFn: () => queryFail(),
      queryKey: ['test-component-fail-query'],
    },
    new QueryClient({
      defaultOptions: { queries: { retry: false, staleTime: 0 } },
      queryCache: queryClient.getQueryCache(),
    }),
  );
  return (
    <p data-testid="children-fail">
      <span data-testid="children-fail__status">{query.status}</span> -{' '}
      {query.error?.message}
    </p>
  );
};

describe('Without devtools', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    process.env.QUERY_DEVTOOLS_VISIBLE = 'false';
    wrapper = render(
      <QueryClientProvider>
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

describe('With failure', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    queryFail.mockClear();
    wrapper = render(
      <GoogleAnalyticsProvider>
        <QueryClientProvider>
          <TestComponentFail />
        </QueryClientProvider>
      </GoogleAnalyticsProvider>,
    );
    await waitFor(() => expect(queryFail).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(wrapper.queryByTestId('children-fail__status')).toHaveTextContent(
        'error',
      ),
    );
    await waitFor(() =>
      expect(ReactGA.event as jest.Mock).toHaveBeenCalledTimes(1),
    );
  });

  test('Tracks the exception', () => {
    expect(ReactGA.event as jest.Mock).toHaveBeenCalledTimes(1);
  });
});
