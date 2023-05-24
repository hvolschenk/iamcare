import React from 'react';
import { Navigate } from 'react-router-dom';

import { authentication } from '~/src/urls';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isAuthorised?: boolean;
  redirectURL?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  isAuthorised = true,
  redirectURL = authentication(),
}) => {
  if (!isAuthenticated || !isAuthorised) {
    return <Navigate replace to={redirectURL} />;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedRoute;
