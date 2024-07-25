import {
  QueryCache,
  QueryClient,
  QueryClientProvider as ReactQueryQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactGA from 'react-ga4';

import configuration from '~/src/configuration';

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // This is the ONLY place where it is okay
      // to use Google Analytics without the Provider.
      // It's not even that it's okay, this is just outside of context.
      ReactGA.event('exception', {
        description: `API error: ${query.queryKey}: ${error.message}`,
        fatal: false,
      });
    },
  }),
});

interface QueryClientProviderProps {
  children: React.ReactNode;
}

const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
  children,
}) => (
  <ReactQueryQueryClientProvider client={queryClient}>
    {children}
    {configuration.query.isDevtoolsVisible() && <ReactQueryDevtools />}
  </ReactQueryQueryClientProvider>
);

export default QueryClientProvider;
