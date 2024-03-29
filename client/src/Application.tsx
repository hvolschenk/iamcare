import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { Provider as AuthenticationProvider } from '~/src/providers/Authentication';
import { Provider as GooglePlacesProvider } from '~/src/providers/GooglePlaces';
import { Provider as NotificationsProvider } from '~/src/providers/Notifications';
import { Provider as QueryClientProvider } from '~/src/providers/QueryClient';
import { Provider as SearchProvider } from '~/src/providers/Search';
import { Provider as ThemeProvider } from '~/src/providers/ThemeProvider';

import Router from './Router';

const Application: React.FC = () => (
  <QueryClientProvider>
    <ThemeProvider>
      <AuthenticationProvider>
        <GooglePlacesProvider>
          <NotificationsProvider>
            <BrowserRouter>
              <SearchProvider>
                <Router />
              </SearchProvider>
            </BrowserRouter>
          </NotificationsProvider>
        </GooglePlacesProvider>
      </AuthenticationProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default Application;
