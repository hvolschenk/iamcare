import {
  QueryClient,
  QueryClientProvider as ReactQueryQueryClientProvider,
} from '@tanstack/react-query';
import React from 'react';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

interface QueryClientProviderProps {
  children: React.ReactNode;
}

const QueryClientProvider: React.FC<QueryClientProviderProps> = ({
  children,
}) => (
  <ReactQueryQueryClientProvider client={queryClient}>
    {children}
  </ReactQueryQueryClientProvider>
);

export default QueryClientProvider;
