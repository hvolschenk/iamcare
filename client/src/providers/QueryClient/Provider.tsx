import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider as ReactQueryQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';

import configuration from '~/src/configuration';

const queryClient = (queryClientConfig?: QueryClientConfig): QueryClient => {
  const queryClientConfigDefault: QueryClientConfig = {
    defaultOptions: { queries: { staleTime: Infinity } },
  };
  return new QueryClient(queryClientConfig || queryClientConfigDefault);
};

interface QueryClientProviderProps {
  children: React.ReactNode;
  queryClientConfig?: QueryClientConfig;
}

const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
  children,
  queryClientConfig,
}) => (
  <ReactQueryQueryClientProvider client={queryClient(queryClientConfig)}>
    {children}
    {configuration.query.isDevtoolsVisible() && <ReactQueryDevtools />}
  </ReactQueryQueryClientProvider>
);

export default QueryClientProvider;
