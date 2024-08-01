import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { Provider as AuthenticationProvider } from '~/src/providers/Authentication';
import { Provider as CookiesProvider } from '~/src/providers/Cookies';
import { Provider as GoogleAnalyticsProvider } from '~/src/providers/GoogleAnalytics';
import { Provider as GooglePlacesProvider } from '~/src/providers/GooglePlaces';
import { Provider as NotificationsProvider } from '~/src/providers/Notifications';
import { Provider as QueryClientProvider } from '~/src/providers/QueryClient';
import { Provider as ThemeProvider } from '~/src/providers/ThemeProvider';

import router from './router';

const Application: React.FC = () => (
  <GoogleAnalyticsProvider>
    <QueryClientProvider>
      <ThemeProvider>
        <AuthenticationProvider>
          <CookiesProvider>
            <GooglePlacesProvider>
              <NotificationsProvider>
                <RouterProvider router={router} />
              </NotificationsProvider>
            </GooglePlacesProvider>
          </CookiesProvider>
        </AuthenticationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </GoogleAnalyticsProvider>
);

export default Application;
