import { QueryClientConfig } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Provider as AuthenticationProvider } from '~/src/providers/Authentication';
import { Provider as QueryClientProvider } from '~/src/providers/QueryClient';
import { Provider as ThemeProvider } from '~/src/providers/ThemeProvider';
import { User } from '~/src/types/User';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
  logger: {
    error: () => {},
    // eslint-disable-next-line no-console
    log: console.log,
    // eslint-disable-next-line no-console
    warn: console.warn,
  },
};

const user: User = {
  email: 'anonymous@iamcare.com',
  id: 1,
  name: 'Anonymous',
};

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <QueryClientProvider queryClientConfig={queryClientConfig}>
    <AuthenticationProvider value={user}>
      <ThemeProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </ThemeProvider>
    </AuthenticationProvider>
  </QueryClientProvider>
);

const customRender = (ui: React.ReactElement) =>
  // eslint-disable-next-line react/jsx-props-no-spreading
  render(ui, { wrapper: (props) => <Providers {...props} /> });

export * from '@testing-library/react';
export { customRender as render };
