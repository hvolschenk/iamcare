import React from 'react';

interface BootstrapProps {
  children: React.ReactNode;
}

const Bootstrap: React.FC<BootstrapProps> = ({ children }) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <React.Fragment>{children}</React.Fragment>
);

export default Bootstrap;
