import React from 'react';

import { render, RenderResult } from '~/src/testing';
import { thread as threadMock } from '~/src/testing/mocks';

import { Provider, useThread } from './index';

const threadModel = threadMock();

const TestComponent: React.FC = () => {
  const { thread } = useThread();
  return <p data-testid="thread">{thread.id}</p>;
};

let wrapper: RenderResult;

beforeEach(() => {
  wrapper = render(
    <Provider value={threadModel}>
      <TestComponent />
    </Provider>,
  );
});

test('Provides the thread value', () => {
  expect(wrapper.queryByTestId('thread')).toHaveTextContent(
    threadModel.id.toString(),
  );
});
