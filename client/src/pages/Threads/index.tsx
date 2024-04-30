import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from '~/src/components/ProtectedRoute';
import { useAuthentication } from '~/src/providers/Authentication';
import { thread, threadCreate, threads, urlRelative } from '~/src/urls';

import ThreadCreate from './Create/async';
import Thread from './Thread/async';
import ThreadsList from './Threads/async';

const Threads: React.FC = () => {
  const { user } = useAuthentication();

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute isAuthenticated={Boolean(user)}>
            <ThreadsList />
          </ProtectedRoute>
        }
        index
      />
      <Route
        element={
          <ProtectedRoute isAuthenticated={Boolean(user)}>
            <Thread />
          </ProtectedRoute>
        }
        path={urlRelative(thread(), threads())}
      />
      <Route
        element={
          <ProtectedRoute isAuthenticated={Boolean(user)}>
            <ThreadCreate />
          </ProtectedRoute>
        }
        path={urlRelative(threadCreate(), threads())}
      />
    </Routes>
  );
};

export default Threads;
