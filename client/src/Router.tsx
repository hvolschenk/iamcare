import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LayoutBase from '~/src/layouts/Base';
import Authentication from '~/src/pages/Authentication/async';
import Home from '~/src/pages/Home/async';
import User from '~/src/pages/User/async';
import { authentication, root, urlLayout, user } from '~/src/urls';

const Router: React.FC = () => (
  <Routes>
    <Route element={<LayoutBase containerWidth="lg" />} path={root()}>
      <Route element={<Home />} index />
      <Route element={<User />} path={urlLayout(user())} />
    </Route>
    <Route
      element={<LayoutBase containerWidth="sm" />}
      path={urlLayout(authentication())}
    >
      <Route element={<Authentication />} index />
    </Route>
  </Routes>
);

export default Router;
