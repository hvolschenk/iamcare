import React from 'react';
import { useLoaderData, useRouteLoaderData } from 'react-router-dom';

import deleteItem from '~/src/api/items/delete';
import markItemAsGiven from '~/src/api/items/markAsGiven';
import l10n from '~/src/l10n';
import {
  fireEvent,
  RenderResult,
  renderRouter,
  testUser,
  waitFor,
} from '~/src/testing';
import { apiCollectionPaginated, item, user } from '~/src/testing/mocks';
import { Item } from '~/src/types/Item';
import {
  item as itemURL,
  userItems as userItemsURL,
  userItemsItem,
} from '~/src/urls';

import { Component as UserItems } from './index';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useLoaderData: jest.fn(),
    useRouteLoaderData: jest.fn(),
  };
});
jest.mock('~/src/api/items/delete');
jest.mock('~/src/api/items/markAsGiven');
jest.mock('~/src/api/user/getItems');

describe('With a user other than the logged-in user', () => {
  const otherUser = user();

  beforeEach(() => {
    (useRouteLoaderData as jest.Mock).mockClear().mockReturnValue(otherUser);
  });

  describe('With no items', () => {
    const userItems = apiCollectionPaginated<Item>({
      data: [],
      meta: {
        current_page: 1,
        from: 0,
        last_page: 1,
        links: [],
        path: 'path',
        per_page: 15,
        to: 0,
        total: 0,
      },
    });

    let wrapper: RenderResult;

    beforeEach(async () => {
      (useLoaderData as jest.Mock).mockClear().mockReturnValue(userItems);
      wrapper = renderRouter(
        [
          { element: <div data-testid="item" />, path: itemURL() },
          {
            element: <div data-testid="user-items-item" />,
            path: userItemsItem(),
          },
          { Component: UserItems, path: userItemsURL() },
        ],
        [userItemsURL(otherUser.id.toString())],
      );
      await waitFor(() =>
        expect(
          wrapper.queryByTestId('user-items__error--no-items'),
        ).toBeInTheDocument(),
      );
    });

    test('Shows a notification of no items', () => {
      expect(
        wrapper.queryByTestId('user-items__error--no-items'),
      ).toBeInTheDocument();
    });

    test('Does not give the user an option to create a new item', () => {
      expect(
        wrapper.queryByTestId('user-items__error--no-items__create'),
      ).not.toBeInTheDocument();
    });
  });

  describe('With items', () => {
    const userItems = apiCollectionPaginated<Item>({
      data: [item(), item(), item()],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 2,
        links: [],
        path: 'path',
        per_page: 3,
        to: 3,
        total: 5,
      },
    });

    let wrapper: RenderResult;

    beforeEach(async () => {
      (useLoaderData as jest.Mock).mockClear().mockReturnValue(userItems);
      wrapper = renderRouter(
        [
          { element: <div data-testid="item" />, path: itemURL() },
          {
            element: <div data-testid="user-items-item" />,
            path: userItemsItem(),
          },
          { Component: UserItems, path: userItemsURL() },
        ],
        [userItemsURL(otherUser.id.toString())],
      );
      await waitFor(() =>
        expect(wrapper.queryAllByTestId('search-item')).toHaveLength(3),
      );
    });

    test('Shows the correct amount of items', () => {
      expect(wrapper.queryAllByTestId('search-item')).toHaveLength(3);
    });

    describe('Clicking on an item', () => {
      beforeEach(() => {
        fireEvent.click(wrapper.queryAllByTestId('search-item__link')[0]);
      });

      test('Redirects to the item page', () => {
        expect(wrapper.queryByTestId('item')).toBeInTheDocument();
      });
    });

    describe('Paginating', () => {
      const userItemsPaginated = apiCollectionPaginated<Item>({
        data: [item(), item()],
        meta: {
          current_page: 2,
          from: 4,
          last_page: 2,
          links: [],
          path: 'path',
          per_page: 3,
          to: 5,
          total: 5,
        },
      });

      beforeEach(async () => {
        (useLoaderData as jest.Mock)
          .mockClear()
          .mockReturnValue(userItemsPaginated);
        fireEvent.click(
          wrapper.getAllByTestId('user-items__pagination__item')[2],
        );
        await waitFor(() =>
          expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
            userItemsPaginated.data.length,
          ),
        );
      });

      test('Shows the correct amount of items', () => {
        expect(wrapper.queryAllByTestId('search-item')).toHaveLength(
          userItemsPaginated.data.length,
        );
      });
    });
  });
});

describe('With the logged-in user', () => {
  beforeEach(() => {
    (useRouteLoaderData as jest.Mock).mockClear().mockReturnValue(testUser);
  });

  describe('With no items', () => {
    const userItems = apiCollectionPaginated<Item>({
      data: [],
      meta: {
        current_page: 1,
        from: 0,
        last_page: 1,
        links: [],
        path: 'path',
        per_page: 15,
        to: 0,
        total: 0,
      },
    });

    let wrapper: RenderResult;

    beforeEach(async () => {
      (useLoaderData as jest.Mock).mockClear().mockReturnValue(userItems);
      wrapper = renderRouter(
        [
          { element: <div data-testid="item" />, path: itemURL() },
          {
            element: <div data-testid="user-items-item" />,
            path: userItemsItem(),
          },
          { Component: UserItems, path: userItemsURL() },
        ],
        [userItemsURL(testUser.id.toString())],
      );
      await waitFor(() =>
        expect(
          wrapper.queryByTestId('user-items__error--no-items'),
        ).toBeInTheDocument(),
      );
    });

    test('Shows the "create new item" fab button', () => {
      expect(wrapper.queryByTestId('user-items__create')).toBeInTheDocument();
    });

    test('Shows the correct error message', () => {
      expect(
        wrapper.queryByTestId('user-items__error--no-items'),
      ).toHaveTextContent(l10n.userItemsErrorNoItemsSelf);
    });

    test('Shows the "create new item" button in the error', () => {
      expect(
        wrapper.queryByTestId('user-items__error--no-items__create'),
      ).toBeInTheDocument();
    });
  });

  describe('With items', () => {
    const userItems = apiCollectionPaginated<Item>({
      data: [item(), item(), item()],
      meta: {
        current_page: 1,
        from: 1,
        last_page: 2,
        links: [],
        path: 'path',
        per_page: 3,
        to: 3,
        total: 5,
      },
    });

    let wrapper: RenderResult;

    beforeEach(async () => {
      (useLoaderData as jest.Mock).mockClear().mockReturnValue(userItems);
      wrapper = renderRouter(
        [
          { element: <div data-testid="item" />, path: itemURL() },
          {
            element: <div data-testid="user-items-item" />,
            path: userItemsItem(),
          },
          { Component: UserItems, path: userItemsURL() },
        ],
        [userItemsURL(testUser.id.toString())],
      );
      await waitFor(() =>
        expect(wrapper.queryAllByTestId('user-items__item')).toHaveLength(3),
      );
    });

    describe('Opening a context menu', () => {
      beforeEach(() => {
        fireEvent.click(
          wrapper.getAllByTestId('user-items__item__context-menu')[0],
        );
      });

      describe('Marking an item as given', () => {
        beforeEach(() => {
          fireEvent.click(
            wrapper.getAllByTestId('user-items__item__mark-as-given')[0],
          );
        });

        describe('When the API call fails', () => {
          beforeEach(async () => {
            (markItemAsGiven as jest.Mock)
              .mockClear()
              .mockRejectedValue(new Error('Failed to mark as given'));
            fireEvent.click(wrapper.getByTestId('item__mark-as-given'));
            await waitFor(() =>
              expect(markItemAsGiven).toHaveBeenCalledTimes(1),
            );
            await waitFor(() =>
              expect(
                wrapper.queryByTestId('notifications__notification'),
              ).toBeInTheDocument(),
            );
          });

          test('Shows a notification indicating that marking as given failed', () => {
            expect(
              wrapper.queryByTestId('notifications__notification'),
            ).toHaveTextContent(l10n.itemMarkAsGivenError);
          });
        });

        describe('When the API call succeeds', () => {
          beforeEach(async () => {
            (markItemAsGiven as jest.Mock).mockClear().mockResolvedValue({
              data: { ...userItems.data[0], isGiven: true },
              status: 200,
            });
            fireEvent.click(wrapper.getByTestId('item__mark-as-given'));
            await waitFor(() =>
              expect(markItemAsGiven).toHaveBeenCalledTimes(1),
            );
            await waitFor(() =>
              expect(
                wrapper.queryByTestId('notifications__notification'),
              ).toBeInTheDocument(),
            );
          });

          test('Shows a notification indicating that marking as given succeeded', () => {
            expect(
              wrapper.queryByTestId('notifications__notification'),
            ).toHaveTextContent(l10n.itemMarkAsGivenSuccess);
          });
        });
      });

      describe('Deleting an item', () => {
        beforeEach(() => {
          fireEvent.click(
            wrapper.getByTestId('user-items__item__delete-dialog'),
          );
        });

        describe('When deleting fails', () => {
          beforeEach(async () => {
            (deleteItem as jest.Mock)
              .mockClear()
              .mockRejectedValue(new Error('Failed to delete'));
            fireEvent.click(wrapper.getByTestId('item__delete'));
            await waitFor(() => expect(deleteItem).toHaveBeenCalledTimes(1));
            await waitFor(() =>
              expect(
                wrapper.queryByTestId('notifications__notification'),
              ).toBeInTheDocument(),
            );
          });

          test('Shows a notification with the error', () => {
            expect(
              wrapper.queryByTestId('notifications__notification'),
            ).toHaveTextContent(l10n.itemDeleteErrorDeleting);
          });
        });

        describe('When deleting succeeds', () => {
          beforeEach(async () => {
            (deleteItem as jest.Mock)
              .mockClear()
              .mockResolvedValue({ status: 204 });
            fireEvent.click(wrapper.getByTestId('item__delete'));
            await waitFor(() => expect(deleteItem).toHaveBeenCalledTimes(1));
            await waitFor(() =>
              expect(
                wrapper.queryByTestId('notifications__notification'),
              ).toBeInTheDocument(),
            );
          });

          test('Shows a success notification', () => {
            expect(
              wrapper.queryByTestId('notifications__notification'),
            ).toHaveTextContent(l10n.itemDeleteSuccess);
          });
        });
      });
    });
  });
});

describe('With no logged-in user', () => {
  beforeEach(() => {
    (useRouteLoaderData as jest.Mock).mockClear().mockReturnValue(user());
  });

  const userItems = apiCollectionPaginated<Item>({
    data: [],
    meta: {
      current_page: 1,
      from: 0,
      last_page: 1,
      links: [],
      path: 'path',
      per_page: 15,
      to: 0,
      total: 0,
    },
  });

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(userItems);
    wrapper = renderRouter(
      [
        { element: <div data-testid="item" />, path: itemURL() },
        {
          element: <div data-testid="user-items-item" />,
          path: userItemsItem(),
        },
        { Component: UserItems, path: userItemsURL() },
      ],
      [userItemsURL(testUser.id.toString())],
      { user: null },
    );
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('user-items__error--no-items'),
      ).toBeInTheDocument(),
    );
  });

  test('Does not shows the "create new item" fab button', () => {
    expect(wrapper.queryByTestId('user-items__create')).not.toBeInTheDocument();
  });
});
