import React from 'react';
import { Route, Routes } from 'react-router-dom';

import getUser from '~/src/api/user/get';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import { User as UserModel } from '~/src/types/User';
import { urlLayout, user as userURL } from '~/src/urls';

import User from './index';

jest.mock('~/src/api/user/get');
jest.mock('./Items/async', () => {
  const ItemsMock: React.FC = () => <div data-testid="items" />;
  return ItemsMock;
});
jest.mock('./Profile/async', () => {
  const ProfileMock: React.FC = () => <div data-testid="profile" />;
  return ProfileMock;
});

const user: UserModel = {
  email: 'atreyu@neverendingstory.com',
  id: 22,
  name: 'Atreyu',
};

describe('When the API call fails', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (getUser as jest.Mock)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch'));
    wrapper = render(
      <Routes>
        <Route element={<User />} path={urlLayout(userURL())} />
      </Routes>,
      {
        router: { initialEntries: [userURL(user.id.toString())] },
      },
    );
    await waitFor(() => expect(getUser).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(wrapper.queryByTestId('user__error__retry')).toBeInTheDocument(),
    );
  });

  test('Shows the retry button', () => {
    expect(wrapper.queryByTestId('user__error__retry')).toBeInTheDocument();
  });

  describe('When retrying and the API call succeeds', () => {
    beforeEach(async () => {
      (getUser as jest.Mock)
        .mockClear()
        .mockResolvedValue({ data: user, status: 200 });
      fireEvent.click(wrapper.getByTestId('user__error__retry'));
      await waitFor(() => expect(getUser).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(wrapper.queryByTestId('profile')).toBeInTheDocument(),
      );
    });

    test('Renders the child routes', () => {
      expect(wrapper.queryByTestId('profile')).toBeInTheDocument();
    });
  });
});
