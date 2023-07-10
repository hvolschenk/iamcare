import React from 'react';

import { render, RenderResult } from '~/src/testing';
import { user as userMock } from '~/src/testing/mocks';

import { Provider, useUser } from './index';

const userModel = userMock();

const TestComponent: React.FC = () => {
  const { user } = useUser();
  return <p data-testid="user">{user.name}</p>;
};

let wrapper: RenderResult;

beforeEach(() => {
  wrapper = render(
    <Provider value={userModel}>
      <TestComponent />
    </Provider>,
  );
});

test('Provides the user value', () => {
  expect(wrapper.queryByTestId('user')).toHaveTextContent(userModel.name);
});
