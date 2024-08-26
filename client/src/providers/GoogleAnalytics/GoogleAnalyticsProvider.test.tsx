import React from 'react';
import ReactGA from 'react-ga4';
import type { GA4 } from 'react-ga4/types/ga4';

import { type RenderResult, fireEvent, render } from '~/src/testing';
import { item as itemMock, tag as tagMock } from '~/src/testing/mocks';

import { Provider, useGoogleAnalytics } from './index';

jest.mock('react-ga4');
jest.unmock('~/src/providers/GoogleAnalytics/Provider');
jest.unmock('~/src/providers/GoogleAnalytics/useGoogleAnalytics');

const TestComponent: React.FC = () => {
  const {
    initialize,
    set,
    trackCustomEvent,
    trackException,
    trackLogin,
    trackPageView,
    trackSearch,
    trackSelectContent,
    trackSelectItem,
    trackShare,
    trackViewItem,
    trackViewItemList,
  } = useGoogleAnalytics();
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
        data-testid="set"
        onClick={() => set({ key: 'value' })}
        type="button"
      >
        Set
      </button>
      <button
        data-testid="track-exception"
        onClick={() =>
          trackException({ description: 'exception', fatal: true })
        }
        type="button"
      >
        Track exception
      </button>
      <button
        data-testid="track-login"
        onClick={() => trackLogin({ method: 'Google' })}
        type="button"
      >
        Track login
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
      <button
        data-testid="track-search"
        onClick={() => trackSearch({ query: 'query' })}
        type="button"
      >
        Track search
      </button>
      <button
        data-testid="track-search-empty"
        onClick={() => trackSearch({})}
        type="button"
      >
        Track search (empty)
      </button>
      <button
        data-testid="track-select-content"
        onClick={() =>
          trackSelectContent({ identifier: 'identifier', type: 'tag' })
        }
        type="button"
      >
        Track select content
      </button>
      <button
        data-testid="track-select-item"
        onClick={() => trackSelectItem({ item: itemMock() })}
        type="button"
      >
        Track select item
      </button>

      <button
        data-testid="track-share"
        onClick={() =>
          trackShare({
            content_type: 'item',
            item_id: itemMock().id.toString(),
          })
        }
        type="button"
      >
        Track share
      </button>

      <button
        data-testid="track-view-item"
        onClick={() => trackViewItem({ item: itemMock() })}
        type="button"
      >
        Track view item
      </button>
      <button
        data-testid="track-view-item-list"
        onClick={() =>
          trackViewItemList({
            items: [
              itemMock({ tags: [] }),
              itemMock({
                tags: [tagMock(), tagMock(), tagMock(), tagMock(), tagMock()],
              }),
            ],
          })
        }
        type="button"
      >
        Track view item list
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

type TestCase = [name: string, selector: string, method: keyof GA4];
describe.each<TestCase>([
  ['initialize', 'initialize', 'initialize'],
  ['set', 'set', 'set'],
  ['trackCustomEvent', 'track-custom-event', 'event'],
  ['trackException', 'track-exception', 'event'],
  ['trackLogin', 'track-login', 'event'],
  ['trackPageView', 'track-page-view', 'send'],
  ['trackSearch', 'track-search', 'event'],
  ['trackSearch (Empty)', 'track-search-empty', 'event'],
  ['trackSelectContent', 'track-select-content', 'event'],
  ['trackSelectItem', 'track-select-item', 'event'],
  ['trackShare', 'track-share', 'event'],
  ['trackViewItem', 'track-view-item', 'event'],
  ['trackViewItemList', 'track-view-item-list', 'event'],
])('%s', (name, selector, method) => {
  beforeEach(() => {
    (ReactGA[method] as jest.Mock).mockClear();
    fireEvent.click(wrapper.getByTestId(selector));
  });

  test(`Calls the ${method} method`, () => {
    expect(ReactGA[method]).toHaveBeenCalledTimes(1);
  });
});
