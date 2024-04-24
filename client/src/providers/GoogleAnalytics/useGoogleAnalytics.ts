import React from 'react';

import GoogleAnalyticsContext from './context';

const useGoogleAnalytics = () => {
  const context = React.useContext(GoogleAnalyticsContext);
  return context;
};

export default useGoogleAnalytics;
