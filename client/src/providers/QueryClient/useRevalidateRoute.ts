import React from 'react';
import { useNavigate } from 'react-router-dom';

const useRevalidateRoute = () => {
  const navigate = useNavigate();
  return React.useCallback(() => {
    navigate('.', { replace: true });
  }, [navigate]);
};

export default useRevalidateRoute;
