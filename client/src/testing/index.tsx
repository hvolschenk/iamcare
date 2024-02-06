import { QueryClientConfig } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

import { Provider as AuthenticationProvider } from '~/src/providers/Authentication';
import { Provider as GooglePlacesProvider } from '~/src/providers/GooglePlaces';
import { Provider as NotificationsProvider } from '~/src/providers/Notifications';
import { Provider as QueryClientProvider } from '~/src/providers/QueryClient';
import { Provider as SearchProvider } from '~/src/providers/Search';
import { Provider as ThemeProvider } from '~/src/providers/ThemeProvider';
import { User } from '~/src/types/User';

import { user } from './mocks';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
};

export const testUser = user();

interface Options {
  router: MemoryRouterProps;
  // The `AuthenticationProvider` expects `User | undefined` as a value,
  // if we accept `undefined` here then JS will always fall back to `testUser`
  // meaning that we cannot test anything with no logged-in user.
  user: User | null;
}

interface ProvidersProps {
  children: React.ReactNode;
  options?: Partial<Options>;
}

const Providers: React.FC<ProvidersProps> = ({ children, options }) => (
  <QueryClientProvider queryClientConfig={queryClientConfig}>
    <AuthenticationProvider
      value={options?.user === null ? undefined : testUser}
    >
      <ThemeProvider>
        <GooglePlacesProvider>
          <NotificationsProvider>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <MemoryRouter {...options?.router}>
              <SearchProvider>{children}</SearchProvider>
            </MemoryRouter>
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
