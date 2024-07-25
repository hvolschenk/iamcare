import React from 'react';
import { RouteObject, useLoaderData } from 'react-router-dom';

import l10n from '~/src/l10n';
import {
  fireEvent,
  renderRouter,
  RenderResult,
  testUser,
  waitFor,
} from '~/src/testing';
import {
  apiCollectionPaginated,
  item as itemMock,
  thread as threadMock,
} from '~/src/testing/mocks';
import { Thread } from '~/src/types/Thread';
import { thread, threads as threadsURL } from '~/src/urls';

import { Component as Threads } from './index';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useLoaderData: jest.fn(),
  };
});
jest.mock('~/src/api/threads/all');

describe('With no items', () => {
  const data = apiCollectionPaginated<Thread>({
    data: [],
    meta: {
      current_page: 1,
      from: 0,
      last_page: 1,
      links: [],
      path: '',
      per_page: 3,
      to: 0,
      total: 0,
    },
  });

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(data);
    const routes: RouteObject[] = [
      { Component: Threads, path: threadsURL() },
      { element: <div data-testid="thread" />, path: thread() },
    ];
    wrapper = renderRouter(routes, [threadsURL()]);
    await waitFor(() =>
      expect(wrapper.queryAllByTestId('threads__thread')).toHaveLength(
        data.data.length,
      ),
    );
  });

  test('Shows a notification indicating that there are no threads', () => {
    expect(wrapper.queryByTestId('threads__error--no-items')).toHaveTextContent(
      l10n.threadsErrorNoItems,
    );
  });
});

describe('With items', () => {
  const data = apiCollectionPaginated<Thread>({
    data: [
      threadMock({ userGiver: testUser }),
      threadMock({ userReceiver: testUser }),
      threadMock({ item: itemMock({ isGiven: true }) }),
      threadMock(),
    ],
    meta: {
      current_page: 1,
      from: 1,
      last_page: 2,
      links: [],
      path: '',
      per_page: 3,
      to: 3,
      total: 4,
    },
  });

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(data);

    const routes: RouteObject[] = [
      { Component: Threads, path: threadsURL() },
      { element: <div data-testid="thread" />, path: thread() },
    ];

    wrapper = renderRouter(routes, [threadsURL()]);
    await waitFor(() =>
      expect(wrapper.queryAllByTestId('threads__thread')).toHaveLength(
        data.data.length,
      ),
    );
  });

  test('Renders the correct amount of threads', () => {
    expect(wrapper.queryAllByTestId('threads__thread')).toHaveLength(
      data.data.length,
    );
  });

  describe('Pagination', () => {
    const dataPage2 = apiCollectionPaginated<Thread>({
      data: [threadMock()],
      meta: {
        current_page: 2,
        from: 4,
        last_page: 2,
        links: [],
        path: '',
        per_page: 3,
        to: 4,
        total: 4,
      },
    });

    beforeEach(async () => {
      (useLoaderData as jest.Mock).mockClear().mockReturnValue(dataPage2);
      fireEvent.click(wrapper.getAllByTestId('threads__pagination__item')[2]);
      await waitFor(() =>
        expect(wrapper.queryAllByTestId('threads__thread')).toHaveLength(
          dataPage2.data.length,
        ),
      );
    });

    test('Renders the second page of items', () => {
      expect(wrapper.queryAllByTestId('threads__thread')).toHaveLength(
        dataPage2.data.length,
      );
    });
  });

  describe('Clicking a thread', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getAllByTestId('threads__thread')[0]);
    });

    test('Redirects to the single thread page', () => {
      expect(wrapper.queryByTestId('thread')).toBeInTheDocument();
    });
  });
});
