import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Provider as AuthenticationProvider } from '~/src/providers/Authentication';
import { Provider as CookiesProvider } from '~/src/providers/Cookies';
import { Provider as GoogleAnalyticsProvider } from '~/src/providers/GoogleAnalytics';
import { Provider as GooglePlacesProvider } from '~/src/providers/GooglePlaces';
import { Provider as NotificationsProvider } from '~/src/providers/Notifications';
import { Provider as QueryClientProvider } from '~/src/providers/QueryClient';
import { Provider as SearchProvider } from '~/src/providers/Search';
import { Provider as ThemeProvider } from '~/src/providers/ThemeProvider';

import Bootstrap from './Bootstrap';
import Router from './Router';

const Application: React.FC = () => (
  <QueryClientProvider>
    <GoogleAnalyticsProvider>
      <ThemeProvider>
        <AuthenticationProvider>
          <CookiesProvider>
            <GooglePlacesProvider>
              <NotificationsProvider>
                <BrowserRouter>
                  <SearchProvider>
                    <Bootstrap>
                      <Router />
                    </Bootstrap>
                  </SearchProvider>
                </BrowserRouter>
              </NotificationsProvider>
            </GooglePlacesProvider>
          </CookiesProvider>
        </AuthenticationProvider>
      </ThemeProvider>
    </GoogleAnalyticsProvider>
  </QueryClientProvider>
);

export default Application;
