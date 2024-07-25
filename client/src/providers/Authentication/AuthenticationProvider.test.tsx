import { faker } from '@faker-js/faker';
import { AxiosResponse } from 'axios';
import React from 'react';

import authenticateMe from '~/src/api/user/me';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import { user as userMock } from '~/src/testing/mocks';
import { User } from '~/src/types/User';

import { useAuthentication } from './index';

jest.mock('~/src/api/user/me');
jest.unmock('~/src/providers/Authentication/Provider');
jest.unmock('~/src/providers/Authentication/useAuthentication');

const user = userMock({ email: faker.internet.email() });

describe('When the user API call fails', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (authenticateMe as jest.Mock<Promise<AxiosResponse<User | void>>>)
      .mockClear()
      .mockRejectedValue(new Error('Failed to fetch the user'));
    wrapper = render(<div data-testid="authentication-provider__child" />, {
      user: null,
    });
    await waitFor(() => expect(authenticateMe).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('authentication-provider__error__loading'),
      ).toBeInTheDocument(),
    );
  });

  test('Renders an error message', () => {
    expect(
      wrapper.queryByTestId('authentication-provider__error__loading'),
    ).toBeInTheDocument();
  });

  test('Renders an action to try again', () => {
    expect(
      wrapper.queryByTestId('authentication-provider__error__loading__action'),
    ).toBeInTheDocument();
  });

  describe('Retrying and the API call succeeds', () => {
    describe('With no user (empty response', () => {
      beforeEach(async () => {
        (authenticateMe as jest.Mock<Promise<AxiosResponse<User | void>>>)
          .mockClear()
          .mockResolvedValue({ status: 204 } as AxiosResponse<User | void>);
        fireEvent.click(
          wrapper.getByTestId(
            'authentication-provider__error__loading__action',
          ),
        );
        await waitFor(() => expect(authenticateMe).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('authentication-provider__child'),
          ).toBeInTheDocument(),
        );
      });

      test('Renders the children', () => {
        expect(
          wrapper.queryByTestId('authentication-provider__child'),
        ).toBeInTheDocument();
      });
    });

    describe('With a user', () => {
      beforeEach(async () => {
        (authenticateMe as jest.Mock<Promise<AxiosResponse<User | void>>>)
          .mockClear()
          .mockResolvedValue({
            data: user,
            status: 200,
          } as AxiosResponse<User | void>);
        fireEvent.click(
          wrapper.getByTestId(
            'authentication-provider__error__loading__action',
          ),
        );
        await waitFor(() => expect(authenticateMe).toHaveBeenCalledTimes(1));
        await waitFor(() =>
          expect(
            wrapper.queryByTestId('authentication-provider__child'),
          ).toBeInTheDocument(),
        );
      });

      test('Renders the children', () => {
        expect(
          wrapper.queryByTestId('authentication-provider__child'),
        ).toBeInTheDocument();
      });
    });
  });
});

describe('useAuthentication', () => {
  const TestComponent: React.FC = () => {
    const { user: authenticatedUser } = useAuthentication();
    return <div data-testid="user__email">{authenticatedUser?.email}</div>;
  };

  let wrapper: RenderResult;

  beforeEach(async () => {
    (authenticateMe as jest.Mock<Promise<AxiosResponse<User | void>>>)
      .mockClear()
      .mockResolvedValue({
        data: user,
        status: 200,
      } as AxiosResponse<User | void>);
    wrapper = render(<TestComponent />, { user });
    await waitFor(() =>
      expect(wrapper.queryByTestId('user__email')).toHaveTextContent(
        user.email!,
      ),
    );
  });

  test('Gets the user from context', () => {
    expect(wrapper.queryByTestId('user__email')).toHaveTextContent(user.email!);
  });
});
