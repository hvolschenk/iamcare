import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { urlRelative, user, userItems } from '~/src/urls';

import Items from './Items/async';
import Profile from './Profile/async';

const User: React.FC = () => (
  <Routes>
    <Route element={<Profile />} path={urlRelative(user(), user())} />
    <Route element={<Items />} path={urlRelative(userItems(), user())} />
  </Routes>
);

export default User;
