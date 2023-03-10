import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Authentication from '~/src/pages/Authentication/async';
import { Provider as AuthenticationProvider } from '~/src/providers/Authentication';
import { Provider as QueryClientProvider } from '~/src/providers/QueryClient';
import { authentication } from '~/src/urls';

const Application: React.FC = () => (
  <QueryClientProvider>
    <AuthenticationProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Authentication />} path={authentication()} />
        </Routes>
      </BrowserRouter>
    </AuthenticationProvider>
  </QueryClientProvider>
);

export default Application;
