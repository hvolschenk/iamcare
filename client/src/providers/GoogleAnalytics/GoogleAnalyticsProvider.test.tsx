import React from 'react';
import ReactGA from 'react-ga4';

import { fireEvent, render, RenderResult } from '~/src/testing';

import { Provider, useGoogleAnalytics } from './index';

jest.mock('react-ga4');
jest.unmock('~/src/providers/GoogleAnalytics/Provider');
jest.unmock('~/src/providers/GoogleAnalytics/useGoogleAnalytics');

const TestComponent: React.FC = () => {
  const { initialize, trackCustomEvent, trackPageView } = useGoogleAnalytics();
  return (
    <React.Fragment>
      <button
        data-testid="initialize"
        onClick={() => initialize()}
        type="button"
      >
        Initialize
      </button>
      <button
        data-testid="track-custom-event"
        onClick={() =>
          trackCustomEvent({ action: 'action', category: 'category' })
        }
        type="button"
      >
        Track custom event
      </button>
      <button
        data-testid="track-page-view"
        onClick={() => trackPageView({ page: 'page' })}
        type="button"
      >
        Track page view
      </button>
    </React.Fragment>
  );
};

let wrapper: RenderResult;

beforeEach(() => {
  wrapper = render(
    <Provider>
      <TestComponent />
    </Provider>,
  );
});

describe('initialize', () => {
  beforeEach(() => {
    (ReactGA.initialize as jest.Mock).mockClear();
    fireEvent.click(wrapper.getByTestId('initialize'));
  });

  test('Calls the initialize method', () => {
    expect(ReactGA.initialize).toHaveBeenCalledTimes(1);
  });
});

describe('trackCustomEvent', () => {
  beforeEach(() => {
    (ReactGA.event as jest.Mock).mockClear();
    fireEvent.click(wrapper.getByTestId('track-custom-event'));
  });

  test('Calls the event method', () => {
    expect(ReactGA.event).toHaveBeenCalledTimes(1);
  });
});

describe('trackPageView', () => {
  beforeEach(() => {
    (ReactGA.send as jest.Mock).mockClear();
    fireEvent.click(wrapper.getByTestId('track-page-view'));
  });

  test('Calls the send method', () => {
    expect(ReactGA.send).toHaveBeenCalledTimes(1);
  });
});
