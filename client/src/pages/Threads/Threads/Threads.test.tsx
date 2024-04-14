import React from 'react';
import { Route, Routes } from 'react-router-dom';

import threads from '~/src/api/threads/all';
import l10n from '~/src/l10n';
import {
  fireEvent,
  render,
  RenderResult,
  testUser,
  waitFor,
} from '~/src/testing';
import { item as itemMock, thread as threadMock } from '~/src/testing/mocks';
import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Thread } from '~/src/types/Thread';
import { thread, threads as threadsURL } from '~/src/urls';

import Threads from './index';

jest.mock('~/src/api/threads/all');

describe('When the API call fails', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (threads as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch'));
    wrapper = render(
      <Routes>
        <Route element={<Threads />} path={threadsURL()} />
        <Route element={<div data-testid="thread" />} path={thread()} />
      </Routes>,
      { router: { initialEntries: [threadsURL()] } },
    );
    await waitFor(() => expect(threads).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('threads__error__retry'),
      ).toBeInTheDocument(),
    );
  });

  test('Shows an error indicating that the threads failed to load', () => {
    expect(wrapper.queryByTestId('threads__error__retry')).toBeInTheDocument();
  });

  describe('When retrying and the API call succeeds', () => {
    describe('With no items', () => {
      const data: APICollectionPaginated<Thread> = {
        data: [],
        links: { first: '', last: '', next: null, prev: null },
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
      };
      beforeEach(async () => {
        (threads as jest.Mock).mockClear().mockResolvedValue({
          data,
          status: 200,
        });
        fireEvent.click(wrapper.getByTestId('threads__error__retry'));
        await waitFor(() => expect(threads).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(wrapper.queryAllByTestId('threads__thread')).toHaveLength(
            data.data.length,
          ),
        );
      });

      test('Shows a notification indicating that there are no threads', () => {
        expect(
          wrapper.queryByTestId('threads__error--no-items'),
        ).toHaveTextContent(l10n.threadsErrorNoItems);
      });
    });

    describe('With items', () => {
      const data: APICollectionPaginated<Thread> = {
        data: [
          threadMock({ userGiver: testUser }),
          threadMock({ userReceiver: testUser }),
          threadMock({ item: itemMock({ isGiven: true }) }),
          threadMock(),
        ],
        links: { first: '', last: '', next: null, prev: null },
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
      };
      beforeEach(async () => {
        (threads as jest.Mock).mockClear().mockResolvedValue({
          data,
          status: 200,
        });
        fireEvent.click(wrapper.getByTestId('threads__error__retry'));
        await waitFor(() => expect(threads).toHaveBeenCalledTimes(1));
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
        const dataPage2: APICollectionPaginated<Thread> = {
          data: [threadMock()],
          links: { first: '', last: '', next: null, prev: null },
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
        };
        beforeEach(async () => {
          (threads as jest.Mock).mockClear().mockResolvedValue({
            data: dataPage2,
            status: 200,
          });
          fireEvent.click(
            wrapper.getAllByTestId('threads__pagination__item')[2],
          );
          await waitFor(() => expect(threads).toHaveBeenCalledTimes(1));
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
  });
});
