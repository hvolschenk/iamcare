import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { render, RenderResult } from '~/src/testing';
import { authentication } from '~/src/urls';

import ProtectedRoute from './index';

interface SampleApplicationProps {
  isAuthenticated: boolean;
  isAuthorised?: boolean;
  redirectURL?: string;
}

const SampleApplication: React.FC<SampleApplicationProps> = ({
  isAuthenticated,
  isAuthorised,
  redirectURL,
}) => (
  <Routes>
    <Route
      element={<div data-testid="authentication" />}
      path={authentication()}
    />
    <Route element={<div data-testid="home" />} path="/home" />
    <Route
      element={
        <ProtectedRoute
          isAuthenticated={isAuthenticated}
          isAuthorised={isAuthorised}
          redirectURL={redirectURL}
        >
          <div data-testid="protected" />
        </ProtectedRoute>
      }
      path="/"
    />
  </Routes>
);

type TableItem = [
  isAuthenticated: boolean,
  isAuthorised: boolean,
  showProtected: boolean,
];
const table: TableItem[] = [
  [false, false, false],
  [false, true, false],
  [true, false, false],
  [true, true, true],
];

describe.each(table)(
  'Authenticated: %s. Authorised: %s.',
  (isAuthenticated, isAuthorised, showProtected) => {
    let wrapper: RenderResult;

    beforeEach(() => {
      wrapper = render(
        <SampleApplication
          isAuthenticated={isAuthenticated}
          isAuthorised={isAuthorised}
          redirectURL="/home"
        />,
        { router: { initialEntries: ['/'] } },
      );
    });

    test('Correctly hides/shows the protected route', () => {
      if (showProtected) {
        expect(wrapper.queryByTestId('protected')).toBeInTheDocument();
      } else {
        expect(wrapper.queryByTestId('protected')).not.toBeInTheDocument();
      }
    });
  },
);

describe('With default parameters', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(<SampleApplication isAuthenticated={false} />, {
      router: { initialEntries: ['/'] },
    });
  });

  test('Redirects to the authentication page', () => {
    expect(wrapper.queryByTestId('authentication')).toBeInTheDocument();
  });
});
