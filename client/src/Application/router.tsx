// This is one of the few places it makes sense to not have object keys sorted
// as having `children` defined before `path` makes it very hard to reason about
// especially since `children` mostly spans many lines.
/* eslint-disable sort-keys */
import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

import ProtectedRoute from '~/src/components/ProtectedRoute';
import BaseLayout from '~/src/layouts/Base';
import { Provider as SearchProvider } from '~/src/providers/Search';
import {
  authentication as authenticationURL,
  healthAndSafety as healthAndSafetyURL,
  item as itemURL,
  items as itemsURL,
  itemsSearch as itemsSearchURL,
  root as rootURL,
  thread as threadURL,
  threadCreate as threadCreateURL,
  threads as threadsURL,
  user as userURL,
  userItems as userItemsURL,
  userItemsCreate as userItemsCreateURL,
  userItemsItem as userItemsItemURL,
} from '~/src/urls';

import ErrorPage from './ErrorPage';

const router = createBrowserRouter([
  {
    element: (
      <SearchProvider>
        <BaseLayout />
      </SearchProvider>
    ),
    errorElement: <ErrorPage />,
    path: rootURL(),
    children: [
      {
        index: true,
        lazy: async () => {
          const { Component, loader } = await import('~/src/pages/Home');
          return { Component, loader };
        },
      },

      {
        lazy: async () => {
          const { Component } = await import('~/src/pages/Authentication');
          return { Component };
        },
        path: authenticationURL({}),
      },

      {
        lazy: async () => {
          const { Component } = await import('~/src/pages/HealthAndSafety');
          return { Component };
        },
        path: healthAndSafetyURL(),
      },

      {
        Component: ProtectedRoute,
        path: threadsURL(),
        children: [
          {
            index: true,
            lazy: async () => {
              const { Component, loader } = await import(
                '~/src/pages/Threads/Threads'
              );
              return { Component, loader };
            },
          },
          {
            lazy: async () => {
              const { Component, loader } = await import(
                '~/src/pages/Threads/Thread'
              );
              return { Component, loader };
            },
            path: threadURL(),
          },
          {
            lazy: async () => {
              const { Component, loader } = await import(
                '~/src/pages/Threads/Create'
              );
              return { Component, loader };
            },
            path: threadCreateURL(),
          },
        ],
      },

      {
        Component: Outlet,
        id: 'user',
        lazy: async () => {
          const { loader } = await import('~/src/pages/User');
          return { loader };
        },
        path: userURL(),
        children: [
          {
            index: true,
            lazy: async () => {
              const { Component } = await import('~/src/pages/User/Profile');
              return { Component };
            },
          },
          {
            lazy: async () => {
              const { Component, loader } = await import(
                '~/src/pages/User/Items/Items'
              );
              return { Component, loader };
            },
            path: userItemsURL(),
          },
          {
            lazy: async () => {
              const { Component } = await import(
                '~/src/pages/User/Items/Create'
              );
              return { Component };
            },
            path: userItemsCreateURL(),
          },
          {
            lazy: async () => {
              const { Component, loader } = await import(
                '~/src/pages/User/Items/Item'
              );
              return { Component, loader };
            },
            path: userItemsItemURL(),
          },
        ],
      },

      {
        Component: Outlet,
        path: itemsURL(),
        children: [
          {
            lazy: async () => {
              const { Component, loader } = await import('~/src/pages/Search');
              return { Component, loader };
            },
            path: itemsSearchURL(),
          },
          {
            lazy: async () => {
              const { Component, loader } = await import('~/src/pages/Item');
              return { Component, loader };
            },
            path: itemURL(),
          },
        ],
      },
    ],
  },
]);

export default router;
