import React from 'react';
import { Routes, Route } from 'react-router-dom';

import ProtectedRoute from '~/src/components/ProtectedRoute';
import { useAuthentication } from '~/src/providers/Authentication';
import { urlRelative, userItems, userItemsCreate } from '~/src/urls';

import ItemCreate from './Create/async';
import ItemsPage from './Items/async';

const Items: React.FC = () => {
  const { user } = useAuthentication();

  return (
    <Routes>
      <Route element={<ItemsPage />} index />
      <Route
        element={
          <ProtectedRoute isAuthenticated={Boolean(user)}>
            <ItemCreate />
          </ProtectedRoute>
        }
        path={urlRelative(userItemsCreate(), userItems())}
      />
    </Routes>
  );
};

export default Items;
