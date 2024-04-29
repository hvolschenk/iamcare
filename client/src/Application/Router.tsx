import React from 'react';
import { Route, Routes } from 'react-router-dom';

import LayoutBase from '~/src/layouts/Base';
import Authentication from '~/src/pages/Authentication/async';
import Home from '~/src/pages/Home/async';
import Item from '~/src/pages/Item/async';
import Search from '~/src/pages/Search/async';
import Threads from '~/src/pages/Threads/async';
import User from '~/src/pages/User/async';
import {
  authentication,
  item,
  itemsSearch,
  root,
  threads,
  urlLayout,
  user,
} from '~/src/urls';

const Router: React.FC = () => (
  <Routes>
    <Route element={<LayoutBase containerWidth="lg" />} path={root()}>
      <Route element={<Home />} index />
      <Route element={<Search />} path={itemsSearch()} />
      <Route element={<Item />} path={item()} />
      <Route element={<Threads />} path={urlLayout(threads())} />
      <Route element={<User />} path={urlLayout(user())} />
    </Route>
    <Route
      element={<LayoutBase containerWidth="sm" />}
      path={urlLayout(authentication({}))}
    >
      <Route element={<Authentication />} index />
    </Route>
  </Routes>
);

export default Router;
