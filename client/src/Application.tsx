import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LayoutBase from '~/src/layouts/Base';
import Authentication from '~/src/pages/Authentication/async';
import { Provider as AuthenticationProvider } from '~/src/providers/Authentication';
import { Provider as QueryClientProvider } from '~/src/providers/QueryClient';
import { Provider as ThemeProvider } from '~/src/providers/ThemeProvider';
import { authentication, root, urlLayout } from '~/src/urls';

const Application: React.FC = () => (
  <QueryClientProvider>
    <AuthenticationProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<LayoutBase containerWidth="lg" />} path={root()} />
            <Route
              element={<LayoutBase containerWidth="sm" />}
              path={urlLayout(authentication())}
            >
              <Route element={<Authentication />} index />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthenticationProvider>
  </QueryClientProvider>
);

export default Application;
