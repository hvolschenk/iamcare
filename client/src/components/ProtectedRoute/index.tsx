import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthentication } from '~/src/providers/Authentication';
import { authentication } from '~/src/urls';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuthentication();

  const redirectURI = React.useMemo<string>(
    () => window.location.href.replace(window.location.origin, ''),
    [],
  );

  if (!user?.id) {
    return <Navigate to={authentication({ redirectURI })} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
