import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LayoutBase from '~/src/layouts/Base';
import Authentication from '~/src/pages/Authentication/async';
import Items from '~/src/pages/Items/async';
import User from '~/src/pages/User/async';
import { authentication, items, root, urlLayout, user } from '~/src/urls';

const Router: React.FC = () => (
  <Routes>
    <Route element={<LayoutBase containerWidth="lg" />} path={root()}>
      <Route element={<Items />} path={urlLayout(items())} />
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
