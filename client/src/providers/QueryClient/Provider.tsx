import {
  QueryCache,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider as ReactQueryQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

import configuration from '~/src/configuration';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';

interface QueryClientProviderProps {
  children: React.ReactNode;
  queryClientConfig?: QueryClientConfig;
}

const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
  children,
  queryClientConfig,
}) => {
  const { trackException } = useGoogleAnalytics();

  const queryClientConfigDefault: QueryClientConfig = {
    defaultOptions: { queries: { staleTime: Infinity } },
    queryCache: new QueryCache({
      onError: (error, query) => {
        trackException({
          description: `API error: ${query.queryKey}: ${error.message}`,
          fatal: false,
        });
      },
    }),
  };

  const queryClient = new QueryClient({
    ...queryClientConfigDefault,
    ...queryClientConfig,
  });

  return (
    <ReactQueryQueryClientProvider client={queryClient}>
      {children}
      {configuration.query.isDevtoolsVisible() && <ReactQueryDevtools />}
    </ReactQueryQueryClientProvider>
  );
};

export default QueryClientProvider;
