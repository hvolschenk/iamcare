import React from 'react';

import CookiesContext from './context';

const useCookies = () => {
  const context = React.useContext(CookiesContext);
  return context;
};

export default useCookies;
