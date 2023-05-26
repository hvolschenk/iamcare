import { QueryClientConfig } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

import { Provider as AuthenticationProvider } from '~/src/providers/Authentication';
import { Provider as GooglePlacesProvider } from '~/src/providers/GooglePlaces';
import { Provider as NotificationsProvider } from '~/src/providers/Notifications';
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

interface Options {
  router: MemoryRouterProps;
}

interface ProvidersProps {
  children: React.ReactNode;
  options?: Partial<Options>;
}

const Providers: React.FC<ProvidersProps> = ({ children, options }) => (
  <QueryClientProvider queryClientConfig={queryClientConfig}>
    <AuthenticationProvider value={user}>
      <ThemeProvider>
        <GooglePlacesProvider>
          <NotificationsProvider>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <MemoryRouter {...options?.router}>{children}</MemoryRouter>
          </NotificationsProvider>
        </GooglePlacesProvider>
      </ThemeProvider>
    </AuthenticationProvider>
  </QueryClientProvider>
);

const customRender = (ui: React.ReactElement, options?: Partial<Options>) =>
  render(ui, {
    // eslint-disable-next-line react/jsx-props-no-spreading
    wrapper: (props) => <Providers {...props} options={options} />,
  });

export * from '@testing-library/react';
export { customRender as render };
