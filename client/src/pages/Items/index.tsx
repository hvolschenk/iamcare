import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from '~/src/components/ProtectedRoute';
import { useAuthentication } from '~/src/providers/Authentication';
import { itemCreate, items, urlRelative } from '~/src/urls';

import ItemCreate from './Create/async';

const Items: React.FC = () => {
  const { user } = useAuthentication();

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute isAuthenticated={Boolean(user)}>
            <ItemCreate />
          </ProtectedRoute>
        }
        path={urlRelative(itemCreate(), items())}
      />
    </Routes>
  );
};

export default Items;
