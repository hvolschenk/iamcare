import { RenderResult, render } from '@testing-library/react';
import React from 'react';
import {
  Outlet,
  RouteObject,
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom';

import { Provider as AuthenticationProvider } from '~/src/providers/Authentication';
import { Provider as GoogleAnalyticsProvider } from '~/src/providers/GoogleAnalytics';
import { Provider as GooglePlacesProvider } from '~/src/providers/GooglePlaces';
import { Provider as NotificationsProvider } from '~/src/providers/Notifications';
import { Provider as QueryClientProvider } from '~/src/providers/QueryClient';
import { Provider as SearchProvider } from '~/src/providers/Search';
import { Provider as ThemeProvider } from '~/src/providers/ThemeProvider';
import { User } from '~/src/types/User';

import { user } from './mocks';

export const testUser = user();

const Layout: React.FC = () => (
  <SearchProvider>
    <Outlet />
  </SearchProvider>
);

interface Options {
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
  <GoogleAnalyticsProvider>
    <QueryClientProvider>
      <AuthenticationProvider
        value={options?.user === null ? undefined : options?.user || testUser}
      >
        <ThemeProvider>
          <GooglePlacesProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
          </GooglePlacesProvider>
        </ThemeProvider>
      </AuthenticationProvider>
    </QueryClientProvider>
  </GoogleAnalyticsProvider>
);

const customRender = (
  ui: React.ReactElement,
  options?: Partial<Options>,
): RenderResult => {
  const router = createMemoryRouter(
    [
      {
        children: [{ element: ui, path: '/test' }],
        Component: Layout,
        path: '/',
      },
    ],
    { initialEntries: ['/test'] },
  );
  return render(<RouterProvider router={router} />, {
    // eslint-disable-next-line react/jsx-props-no-spreading
    wrapper: (props) => <Providers {...props} options={options} />,
  });
};

const customRenderRouter = (
  routes: RouteObject[],
  initialEntries: string[],
  options?: Partial<Options>,
): RenderResult => {
  const router = createMemoryRouter(
    [{ children: routes, Component: Layout, path: '/' }],
    { initialEntries },
  );
  return render(
    <RouterProvider router={router} />,
    // eslint-disable-next-line react/jsx-props-no-spreading
    { wrapper: (props) => <Providers {...props} options={options} /> },
  );
};

export * from '@testing-library/react';
export { customRender as render };
export { customRenderRouter as renderRouter };
