import { TokenResponse, useGoogleLogin } from '@react-oauth/google';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import csrfToken from '~/src/api/authenticate/csrfToken';
import authenticateGoogle from '~/src/api/user/authenticateGoogle';
import l10n from '~/src/l10n';
import { act, fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import { user as userMock } from '~/src/testing/mocks';
import { authentication, item, root } from '~/src/urls';

import Authentication from './index';

jest.mock('@react-oauth/google');
jest.mock('~/src/api/authenticate/csrfToken');
jest.mock('~/src/api/user/authenticateGoogle');

describe('With a redirect URL', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    (useGoogleLogin as jest.Mock).mockClear().mockReturnValue(jest.fn());
    wrapper = render(
      <Routes>
        <Route element={<Authentication />} path={authentication({})} />
        <Route element={<div data-testid="item" />} path={item()} />
        <Route element={<div data-testid="root" />} path={root()} />
      </Routes>,
      {
        router: {
          initialEntries: [authentication({ redirectURI: item('22') })],
        },
      },
    );
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
        const error: Pick<
          TokenResponse,
          'error' | 'error_description' | 'error_uri'
        > = {
          error: 'invalid_request',
          error_description: 'The request is invalid',
          error_uri: 'http://error.com',
        };
        act(() =>
          (useGoogleLogin as jest.Mock).mock.calls[0][0].onError(error),
        );
      });

      test('Shows the error', () => {
        expect(
          wrapper.queryByTestId('authentication__error'),
        ).toHaveTextContent(l10n.authenticateGoogleErrorLoginFailed);
      });
    });

    describe('When a non-oauth error occurs', () => {
      beforeEach(() => {
        act(() =>
          (useGoogleLogin as jest.Mock).mock.calls[0][0].onNonOAuthError({
            type: 'popup_closed',
          }),
        );
      });

      test('Shows the error', () => {
        expect(
          wrapper.queryByTestId('authentication__error'),
        ).toHaveTextContent(l10n.authenticateGoogleErrorLoginFailed);
      });
    });

    describe('When google login succeeds', () => {
      describe('When the API calls fail', () => {
        const ERROR = new Error('Failed to store login information');

        beforeEach(async () => {
          (csrfToken as jest.Mock).mockClear().mockRejectedValue(ERROR);
          (authenticateGoogle as jest.Mock)
            .mockClear()
            .mockRejectedValue(ERROR);
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
        const user = userMock();

        beforeEach(async () => {
          (csrfToken as jest.Mock)
            .mockClear()
            .mockResolvedValue({ status: 204 });
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
            expect(wrapper.queryByTestId('item')).toBeInTheDocument(),
          );
        });

        test('Redirects to the set URL correctly', () => {
          expect(wrapper.queryByTestId('item')).toBeInTheDocument();
        });
      });
    });
  });
});

describe('Without a redirect URL', () => {
  const user = userMock();

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useGoogleLogin as jest.Mock).mockClear().mockReturnValue(jest.fn());
    wrapper = render(
      <Routes>
        <Route element={<Authentication />} path={authentication({})} />
        <Route element={<div data-testid="item" />} path={item()} />
        <Route element={<div data-testid="root" />} path={root()} />
      </Routes>,
      {
        router: { initialEntries: [authentication({})] },
      },
    );
    fireEvent.click(wrapper.getByTestId('authentication-button--google'));
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
    await waitFor(() => expect(authenticateGoogle).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(wrapper.queryByTestId('root')).toBeInTheDocument(),
    );
  });

  test('Redirects to the default URL correctly', () => {
    expect(wrapper.queryByTestId('root')).toBeInTheDocument();
  });
});
