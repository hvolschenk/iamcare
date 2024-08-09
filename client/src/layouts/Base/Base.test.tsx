import { faker } from '@faker-js/faker';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import { useNavigation } from 'react-router-dom';

import unreadThreadsCount from '~/src/api/threads/unread';
import configuration from '~/src/configuration';
import { useCookies } from '~/src/providers/Cookies';
import { useGoogleAnalytics } from '~/src/providers/GoogleAnalytics';
import {
  fireEvent,
  renderRouter,
  RenderResult,
  waitFor,
  render,
} from '~/src/testing';
import { authentication, itemsSearch, root, user } from '~/src/urls';

import Base from './index';

jest.mock('@mui/material/useMediaQuery');
jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useNavigation: jest.fn(),
  };
});
jest.mock('~/src/api/threads/unread');
jest.mock('~/src/providers/Cookies');

const analyticsDisableKey: string = `ga-disable-${configuration.google.analytics.measurementID()}`;
const { initialize } = useGoogleAnalytics();

beforeEach(() => {
  (useMediaQuery as jest.Mock).mockClear().mockReturnValue(true);
  (useNavigation as jest.Mock).mockClear().mockReturnValue({ state: 'idle' });
});

describe('When cookies have not been accepted', () => {
  beforeEach(() => {
    (initialize as jest.Mock).mockClear();
    (useCookies as jest.Mock)
      .mockClear()
      .mockReturnValue({ areCookiesAccepted: false });
    renderRouter(
      [
        {
          element: <Base containerWidth="lg" />,
          path: root(),
        },
      ],
      [root()],
      { user: null },
    );
  });

  test('Does not initialize Google Analytics', () => {
    expect(initialize).toHaveBeenCalledTimes(0);
  });

  test('Sets the global disable variable', () => {
    // @ts-ignore
    expect(global[analyticsDisableKey]).toBe(true);
  });
});

describe('When cookies have been accepted', () => {
  beforeEach(() => {
    (initialize as jest.Mock).mockClear();
    (useCookies as jest.Mock)
      .mockClear()
      .mockReturnValue({ areCookiesAccepted: true });
    (useMediaQuery as jest.Mock).mockClear().mockReturnValue(false);
    renderRouter(
      [
        {
          element: <Base containerWidth="lg" />,
          path: root(),
        },
      ],
      [root()],
      { user: null },
    );
  });

  test('Initializes Google Analytics', () => {
    expect(initialize).toHaveBeenCalledTimes(1);
  });

  test('Sets the global disable variable', () => {
    // @ts-ignore
    expect(global[analyticsDisableKey]).toBe(false);
  });
});

describe('Without a logged-in user', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
    wrapper = renderRouter(
      [
        {
          children: [
            { element: <div data-testid="root" />, index: true },
            {
              element: <div data-testid="authentication" />,
              path: authentication({}),
            },
          ],
          element: <Base containerWidth="lg" />,
          path: root(),
        },
      ],
      [root()],
      { user: null },
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
      wrapper = renderRouter(
        [
          {
            children: [
              { element: <div data-testid="root" />, index: true },
              { element: <div data-testid="search" />, path: itemsSearch() },
              { element: <div data-testid="user" />, path: user() },
            ],
            Component: Base,
            path: root(),
          },
        ],
        [root()],
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
      wrapper = renderRouter(
        [
          {
            children: [
              { element: <div data-testid="root" />, index: true },
              { element: <div data-testid="search" />, path: itemsSearch() },
              { element: <div data-testid="user" />, path: user() },
            ],
            Component: Base,
            path: root(),
          },
        ],
        [root()],
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

describe('When a new page is being loaded', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (unreadThreadsCount as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: { unreadThreads: 22 }, status: 200 });
    (useNavigation as jest.Mock)
      .mockClear()
      .mockReturnValue({ state: 'loading' });
    wrapper = render(<Base />);
    await waitFor(() => expect(unreadThreadsCount).toHaveBeenCalledTimes(1));
  });

  test('Shows a loading indicator', () => {
    expect(wrapper.queryAllByTestId('base-layout__loading')).toHaveLength(3);
  });
});
