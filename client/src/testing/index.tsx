import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

const customRender = (ui: React.ReactElement) =>
  // eslint-disable-next-line react/jsx-props-no-spreading
  render(ui, { wrapper: (props) => <Providers {...props} /> });

export * from '@testing-library/react';
export { customRender as render };
