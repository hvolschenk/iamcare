import { useGoogleLogin } from '@react-oauth/google';
import React from 'react';

import csrfToken from '~/src/api/authenticate/csrfToken';
import authenticateGoogle from '~/src/api/user/authenticateGoogle';
import l10n from '~/src/l10n';
import { act, fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import { User } from '~/src/types/User';

import Authentication from './index';

jest.mock('@react-oauth/google');
jest.mock('~/src/api/authenticate/csrfToken');
jest.mock('~/src/api/user/authenticateGoogle');

let wrapper: RenderResult;

beforeEach(() => {
  (useGoogleLogin as jest.Mock).mockClear().mockReturnValue(jest.fn());
  wrapper = render(<Authentication />);
});

test('Renders the correct amount of authentication providers', () => {
  expect(
    wrapper.queryAllByTestId(/authentication-button--[a-zA-Z-]+/),
  ).toHaveLength(1);
});

describe('Google Login', () => {
  beforeEach(() => {
    fireEvent.click(wrapper.getByTestId('authentication-button--google'));
  });

  describe('When an error occurs', () => {
    beforeEach(() => {
      act((useGoogleLogin as jest.Mock).mock.calls[0][0].onError);
    });

    test('Shows the error', () => {
      expect(wrapper.queryByTestId('authentication__error')).toHaveTextContent(
        l10n.authenticateGoogleErrorLoginFailed,
      );
    });
  });

  describe('When a non-oauth error occurs', () => {
    beforeEach(() => {
      act((useGoogleLogin as jest.Mock).mock.calls[0][0].onNonOAuthError);
    });

    test('Shows the error', () => {
      expect(wrapper.queryByTestId('authentication__error')).toHaveTextContent(
        l10n.authenticateGoogleErrorLoginFailed,
      );
    });
  });

  describe('When google login succeeds', () => {
    describe('When the API calls fail', () => {
      const ERROR = new Error('Failed to store login information');

      beforeEach(async () => {
        (csrfToken as jest.Mock).mockClear().mockRejectedValue(ERROR);
        (authenticateGoogle as jest.Mock).mockClear().mockRejectedValue(ERROR);
        await act(async () =>
          (useGoogleLogin as jest.Mock).mock.calls[0][0].onSuccess(),
        );
        await waitFor(() => expect(csrfToken).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('authentication__error'),
          ).toBeInTheDocument(),
        );
      });

      test('Shows the error', () => {
        expect(
          wrapper.queryByTestId('authentication__error'),
        ).toHaveTextContent(l10n.authenticateGoogleErrorLoginFailed);
      });
    });

    describe('When the API calls succeed', () => {
      const user: User = {
        email: 'atreyu@neverendingstory.com',
        id: 22,
        name: 'Atreyu',
      };

      beforeEach(async () => {
        (csrfToken as jest.Mock).mockClear().mockResolvedValue({ status: 204 });
        (authenticateGoogle as jest.Mock)
          .mockClear()
          .mockResolvedValue({ data: user, status: 200 });
        await act(async () =>
          (useGoogleLogin as jest.Mock).mock.calls[0][0].onSuccess({
            access_token: 'access_token',
          }),
        );
        await waitFor(() => expect(csrfToken).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(authenticateGoogle).toHaveBeenCalledTimes(1),
        );
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('authentication__user'),
          ).toBeInTheDocument(),
        );
      });

      test('Sets the user correctly', () => {
        expect(wrapper.queryByTestId('authentication__user')).toHaveTextContent(
          user.email,
        );
      });
    });
  });
});
