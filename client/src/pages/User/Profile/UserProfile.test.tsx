import React from 'react';
import { Route, Routes } from 'react-router-dom';

import l10n from '~/src/l10n';
import {
  fireEvent,
  render,
  RenderResult,
  testUser,
  waitFor,
} from '~/src/testing';
import { user as userMock } from '~/src/testing/mocks';
import { user, userItems } from '~/src/urls';

import { Provider as UserProvider } from '../context';

import UserProfile from './index';

const mockUser = userMock();

describe('When not logged-in', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(
      <UserProvider value={mockUser}>
        <Routes>
          <Route element={<UserProfile />} path={user()} />
          <Route
            element={<div data-testid="user__items" />}
            path={userItems()}
          />
        </Routes>
      </UserProvider>,
      {
        router: { initialEntries: [user()] },
        user: null,
      },
    );
  });

  test('Renders the correct text for the "user items" link', () => {
    expect(
      wrapper.queryByTestId('user-profile__action--items__text'),
    ).toHaveTextContent(l10n.userItemsView);
  });

  describe('When clicking on the "user items" link', () => {
    beforeEach(async () => {
      fireEvent.click(wrapper.getByTestId('user-profile__action--items'));
      await waitFor(() =>
        expect(wrapper.queryByTestId('user__items')).toBeInTheDocument(),
      );
    });

    test('Redirects to the user items page', () => {
      expect(wrapper.queryByTestId('user__items')).toBeInTheDocument();
    });
  });
});

describe('When logged-in', () => {
  describe('As a user other than the logged-in user', () => {
    let wrapper: RenderResult;

    beforeEach(() => {
      wrapper = render(
        <UserProvider value={mockUser}>
          <Routes>
            <Route element={<UserProfile />} path={user()} />
            <Route
              element={<div data-testid="user__items" />}
              path={userItems()}
            />
          </Routes>
        </UserProvider>,
        {
          router: { initialEntries: [user()] },
        },
      );
    });

    test('Renders the correct text for the "user items" link', () => {
      expect(
        wrapper.queryByTestId('user-profile__action--items__text'),
      ).toHaveTextContent(l10n.userItemsView);
    });

    describe('When clicking on the "user items" link', () => {
      beforeEach(async () => {
        fireEvent.click(wrapper.getByTestId('user-profile__action--items'));
        await waitFor(() =>
          expect(wrapper.queryByTestId('user__items')).toBeInTheDocument(),
        );
      });

      test('Redirects to the user items page', () => {
        expect(wrapper.queryByTestId('user__items')).toBeInTheDocument();
      });
    });
  });

  describe('As the logged-in user', () => {
    let wrapper: RenderResult;

    beforeEach(() => {
      wrapper = render(
        <UserProvider value={testUser}>
          <Routes>
            <Route element={<UserProfile />} path={user()} />
            <Route
              element={<div data-testid="user__items" />}
              path={userItems()}
            />
          </Routes>
        </UserProvider>,
        {
          router: { initialEntries: [user()] },
        },
      );
    });

    test('Renders the correct text for the "user items" link', () => {
      expect(
        wrapper.queryByTestId('user-profile__action--items__text'),
      ).toHaveTextContent(l10n.userItemsManageTitle);
    });

    describe('When clicking on the "user items" link', () => {
      beforeEach(async () => {
        fireEvent.click(wrapper.getByTestId('user-profile__action--items'));
        await waitFor(() =>
          expect(wrapper.queryByTestId('user__items')).toBeInTheDocument(),
        );
      });

      test('Redirects to the user items page', () => {
        expect(wrapper.queryByTestId('user__items')).toBeInTheDocument();
      });
    });
  });
});
