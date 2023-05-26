import React from 'react';

import { act, fireEvent, render, RenderResult, waitFor } from '~/src/testing';

import { useNotifications } from './index';

const SampleComponent: React.FC = () => {
  const [count, setCount] = React.useState<number>(1);
  const { notify } = useNotifications();

  const onClick = React.useCallback(() => {
    notify({ message: `Message ${count}` });
    setCount((currentCount) => currentCount + 1);
  }, [count, notify, setCount]);

  return (
    <button data-testid="notify" onClick={onClick} type="button">
      Notify
    </button>
  );
};

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

let wrapper: RenderResult;

beforeEach(() => {
  // We do not wrap this component in `NotificationsProvider`
  // as the `render` method already wraps all tests in it.
  wrapper = render(<SampleComponent />);
});

describe('When clicking to show notifications', () => {
  beforeEach(async () => {
    fireEvent.click(wrapper.getByTestId('notify'));
    fireEvent.click(wrapper.getByTestId('notify'));
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('notifications__notification'),
      ).toBeInTheDocument(),
    );
  });

  test('Shows the first message', () => {
    expect(
      wrapper.queryByTestId('notifications__notification'),
    ).toHaveTextContent('Message 1');
  });

  describe('After waiting for the first message to disappear', () => {
    beforeEach(() => {
      act(() => jest.advanceTimersByTime(2500));
    });

    test('Shows the second notification message', () => {
      expect(
        wrapper.queryByTestId('notifications__notification'),
      ).toHaveTextContent('Message 2');
    });
  });
});
