import { faker } from '@faker-js/faker';
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import unreadThreadsCount from '~/src/api/threads/unread';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import { authentication, itemsSearch, root, user } from '~/src/urls';

import Base from './index';

jest.mock('~/src/api/threads/unread');

describe('Without a logged-in user', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <Routes>
        <Route element={<Base containerWidth="lg" />} path={root()}>
          <Route element={<div data-testid="root" />} index />
          <Route
            element={<div data-testid="authentication" />}
            path={authentication({})}
          />
        </Route>
      </Routes>,
      { router: { initialEntries: [root()] }, user: null },
    );
  });

  test('Renders an authentication link', () => {
    expect(
      wrapper.queryByTestId('authentication__user-menu__login'),
    ).toBeInTheDocument();
  });

  describe('Clicking on the authentication link', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('authentication__user-menu__login'));
    });

    test('Redirects to the authentication page', () => {
      expect(wrapper.queryByTestId('authentication')).toBeInTheDocument();
    });
  });
});

describe('With a logged-in user', () => {
  describe('When the unread threads API call fails', () => {
    let wrapper: RenderResult;

    beforeEach(async () => {
      (unreadThreadsCount as jest.Mock)
        .mockClear()
        .mockRejectedValue(new Error('Failed to fetch'));
      wrapper = render(
        <Routes>
          <Route element={<Base />} path={root()}>
            <Route element={<div data-testid="root" />} index />
            <Route
              element={<div data-testid="search" />}
              path={itemsSearch()}
            />
            <Route element={<div data-testid="user" />} path={user()} />
          </Route>
        </Routes>,
        { router: { initialEntries: [root()] } },
      );
      await waitFor(() => expect(unreadThreadsCount).toHaveBeenCalledTimes(1));
    });

    test('Shows the unread threads count', () => {
      expect(wrapper.queryByTestId('user__threads__unread')).toHaveTextContent(
        '',
      );
    });
  });

  describe('When the unread threads API call succeeds', () => {
    let wrapper: RenderResult;

    beforeEach(async () => {
      (unreadThreadsCount as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: { unreadThreads: 22 }, status: 200 });
      wrapper = render(
        <Routes>
          <Route element={<Base />} path={root()}>
            <Route element={<div data-testid="root" />} index />
            <Route
              element={<div data-testid="search" />}
              path={itemsSearch()}
            />
            <Route element={<div data-testid="user" />} path={user()} />
          </Route>
        </Routes>,
        { router: { initialEntries: [root()] } },
      );
      await waitFor(() => expect(unreadThreadsCount).toHaveBeenCalledTimes(1));
    });

    test('Shows the unread threads count', () => {
      expect(wrapper.queryByTestId('user__threads__unread')).toHaveTextContent(
        '22',
      );
    });

    test('Renders the user avatar', () => {
      expect(
        wrapper.queryByTestId('authentication__user-menu__avatar'),
      ).toBeInTheDocument();
    });

    describe('Clicking the user avatar', () => {
      beforeEach(() => {
        fireEvent.click(
          wrapper.getByTestId('authentication__user-menu__avatar'),
        );
      });

      test('Redirects to the user profile page', () => {
        expect(wrapper.queryByTestId('user')).toBeInTheDocument();
      });
    });

    describe('Search', () => {
      beforeEach(async () => {
        const query = faker.word.sample();
        fireEvent.click(wrapper.getByTestId('search__open-dialog'));
        fireEvent.change(wrapper.getByTestId('search__input'), {
          target: { value: query },
        });
        await waitFor(() =>
          expect(wrapper.getByTestId('search__input')).toHaveValue(query),
        );
      });

      describe('Searching', () => {
        beforeEach(async () => {
          fireEvent.click(wrapper.getByTestId('search__action--search'));
          await waitFor(() =>
            expect(wrapper.queryByTestId('search')).toBeInTheDocument(),
          );
        });

        test('Redirects to the search page', () => {
          expect(wrapper.queryByTestId('search')).toBeInTheDocument();
        });
      });
    });
  });
});
