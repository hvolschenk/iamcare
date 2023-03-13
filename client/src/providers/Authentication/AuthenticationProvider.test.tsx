import { AxiosResponse } from 'axios';
import React from 'react';

import authenticateMe from '~/src/api/authenticate/me';
import { fireEvent, render, RenderResult, waitFor } from '~/src/testing';
import { User } from '~/src/types/User';

import { Provider, useAuthentication } from './index';

jest.mock('~/src/api/authenticate/me');

describe('When the user API call fails', () => {
  const ERROR = new Error('Failed to fetch the user');

  let wrapper: RenderResult;

  beforeEach(async () => {
    (authenticateMe as jest.Mock<Promise<AxiosResponse<User | void>>>)
      .mockClear()
      .mockRejectedValue(ERROR);
    wrapper = render(
      <Provider>
        <div data-testid="authentication-provider__child" />
      </Provider>,
    );
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
      const user: User = {
        email: 'nicolai@iamcare.com',
        id: 22,
        name: 'Nicolai Tesla',
      };

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
    const { user } = useAuthentication();
    return <div data-testid="user__email">{user?.email}</div>;
  };

  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = render(<TestComponent />);
  });

  test('Gets the user from context', () => {
    expect(wrapper.queryByTestId('user__email')).toHaveTextContent(
      'anonymous@iamcare.com',
    );
  });
});
