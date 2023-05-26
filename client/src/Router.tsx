import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LayoutBase from '~/src/layouts/Base';
import Authentication from '~/src/pages/Authentication/async';
import { authentication, root, urlLayout } from '~/src/urls';

const Router: React.FC = () => (
  <Routes>
    <Route element={<LayoutBase containerWidth="lg" />} path={root()} />
    <Route
      element={<LayoutBase containerWidth="sm" />}
      path={urlLayout(authentication())}
    >
      <Route element={<Authentication />} index />
    </Route>
  </Routes>
);

export default Router;
