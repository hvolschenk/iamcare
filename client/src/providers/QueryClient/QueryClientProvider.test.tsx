// In ALL other cases `render` should be imported from `~/src/testing`.
// In this ONE case we are testing this Provider in isolation,
// and don't need any mocks for it.
import { QueryClientConfig, useQuery } from '@tanstack/react-query';
import { render, RenderResult, waitFor } from '@testing-library/react';
import React from 'react';

import {
  Provider as GoogleAnalyticsProvider,
  useGoogleAnalytics,
} from '~/src/providers/GoogleAnalytics';

import QueryClientProvider from './Provider';

jest.mock('@tanstack/react-query-devtools', () => {
  const ReactQueryDevtools: React.FC = () => <div data-testid="devtools" />;
  return { ReactQueryDevtools };
});

const queryFail = jest.fn().mockRejectedValue(new Error('Failed to query'));

const TestComponentFail: React.FC = () => {
  const query = useQuery({
    queryFn: () => queryFail(),
    queryKey: ['test-component-fail-query'],
  });
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

describe('With failure', () => {
  const { trackException } = useGoogleAnalytics();

  beforeEach(async () => {
    queryFail.mockClear();
    (trackException as jest.Mock).mockClear();
    const queryClientConfig: QueryClientConfig = {
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
        },
      },
    };
    render(
      <GoogleAnalyticsProvider>
        <QueryClientProvider queryClientConfig={queryClientConfig}>
          <TestComponentFail />
        </QueryClientProvider>
      </GoogleAnalyticsProvider>,
    );
    await waitFor(() => expect(queryFail).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(trackException as jest.Mock).toHaveBeenCalledTimes(1),
    );
  });

  test('Tracks the exception', () => {
    expect(trackException as jest.Mock).toHaveBeenCalledTimes(1);
  });
});
