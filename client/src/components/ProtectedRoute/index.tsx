import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { authentication } from '~/src/urls';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isAuthorised?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  isAuthorised = true,
}) => {
  const location = useLocation();

  if (!isAuthenticated || !isAuthorised) {
    return (
      <Navigate
        replace
        to={authentication({ redirectURI: location.pathname })}
      />
    );
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <React.Fragment>{children}</React.Fragment>;
};

export default ProtectedRoute;
