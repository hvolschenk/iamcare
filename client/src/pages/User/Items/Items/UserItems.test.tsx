import React from 'react';

import deleteItem from '~/src/api/items/delete';
import getUserItems from '~/src/api/user/getItems';
import l10n from '~/src/l10n';
import {
  fireEvent,
  render,
  RenderResult,
  testUser,
  waitFor,
} from '~/src/testing';
import { item, user } from '~/src/testing/mocks';
import { APICollectionPaginated } from '~/src/types/APICollectionPaginated';
import { Item } from '~/src/types/Item';

import { Provider as UserProvider } from '../../context';

import UserItems from './index';

jest.mock('~/src/api/items/delete');
jest.mock('~/src/api/user/getItems');

describe('With a user other than the logged-in user', () => {
  describe('When the user items API call fails', () => {
    let wrapper: RenderResult;

    beforeEach(async () => {
      (getUserItems as jest.Mock)
        .mockClear()
        .mockRejectedValue(new Error('Failed to fetch'));
      wrapper = render(
        <UserProvider value={user()}>
          <UserItems />
        </UserProvider>,
      );
      await waitFor(() => expect(getUserItems).toHaveBeenCalledTimes(1));
      await waitFor(() =>
        expect(
          wrapper.queryByTestId('user-items__error--loading__retry'),
        ).toBeInTheDocument(),
      );
    });

    test('Shows the error message with a retry option', () => {
      expect(
        wrapper.queryByTestId('user-items__error--loading__retry'),
      ).toBeInTheDocument();
    });

    describe('When retrying and the user items API call succeeds', () => {
      describe('With no items', () => {
        const userItems: APICollectionPaginated<Item> = {
          data: [],
          links: {
            first: '/first',
            last: '/last',
            next: '/next',
            prev: '/prev',
          },
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
        };

        beforeEach(async () => {
          (getUserItems as jest.Mock)
            .mockClear()
            .mockResolvedValue({ data: userItems, status: 200 });
          fireEvent.click(
            wrapper.getByTestId('user-items__error--loading__retry'),
          );
          await waitFor(() => expect(getUserItems).toHaveBeenCalledTimes(1));
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
        const userItems: APICollectionPaginated<Item> = {
          data: [item(), item(), item()],
          links: {
            first: '/first',
            last: '/last',
            next: '/next',
            prev: '/prev',
          },
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
        };

        beforeEach(async () => {
          (getUserItems as jest.Mock)
            .mockClear()
            .mockResolvedValue({ data: userItems, status: 200 });
          fireEvent.click(
            wrapper.getByTestId('user-items__error--loading__retry'),
          );
          await waitFor(() => expect(getUserItems).toHaveBeenCalledTimes(1));
          await waitFor(() =>
            expect(wrapper.queryAllByTestId('user-items__item')).toHaveLength(
              3,
            ),
          );
        });

        test('Shows the correct amount of items', () => {
          expect(wrapper.queryAllByTestId('user-items__item')).toHaveLength(3);
        });

        describe('Paginating', () => {
          const userItemsPaginated: APICollectionPaginated<Item> = {
            data: [item(), item()],
            links: {
              first: '/first',
              last: '/last',
              next: '/next',
              prev: '/prev',
            },
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
          };

          beforeEach(async () => {
            (getUserItems as jest.Mock)
              .mockClear()
              .mockResolvedValue({ data: userItemsPaginated, status: 200 });
            fireEvent.click(
              wrapper.getAllByTestId('user-items__pagination__item')[2],
            );
            await waitFor(() => expect(getUserItems).toHaveBeenCalledTimes(1));
            await waitFor(() =>
              expect(wrapper.queryAllByTestId('user-items__item')).toHaveLength(
                2,
              ),
            );
          });

          test('Shows the correct amount of items', () => {
            expect(wrapper.queryAllByTestId('user-items__item')).toHaveLength(
              2,
            );
          });
        });

        describe('Opening a context menu', () => {
          beforeEach(() => {
            fireEvent.click(
              wrapper.getAllByTestId('user-items__item__context-menu')[0],
            );
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
                await waitFor(() =>
                  expect(deleteItem).toHaveBeenCalledTimes(1),
                );
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
              const userItemsUpdated: APICollectionPaginated<Item> = {
                data: [item(), item(), item(), item()],
                links: {
                  first: '/first',
                  last: '/last',
                  next: '/next',
                  prev: '/prev',
                },
                meta: {
                  current_page: 1,
                  from: 1,
                  last_page: 1,
                  links: [],
                  path: 'path',
                  per_page: 15,
                  to: 5,
                  total: 5,
                },
              };

              beforeEach(async () => {
                (deleteItem as jest.Mock)
                  .mockClear()
                  .mockResolvedValue({ status: 204 });
                (getUserItems as jest.Mock)
                  .mockClear()
                  .mockResolvedValue({ data: userItemsUpdated, status: 200 });
                fireEvent.click(wrapper.getByTestId('item__delete'));
                await waitFor(() =>
                  expect(deleteItem).toHaveBeenCalledTimes(1),
                );
                await waitFor(() =>
                  expect(getUserItems).toHaveBeenCalledTimes(1),
                );
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

              test('Shows the updated amount of user items', () => {
                expect(
                  wrapper.queryAllByTestId('user-items__item'),
                ).toHaveLength(userItemsUpdated.data.length);
              });
            });
          });
        });
      });
    });
  });
});

describe('With the logged-in user', () => {
  const userItems: APICollectionPaginated<Item> = {
    data: [],
    links: {
      first: '/first',
      last: '/last',
      next: '/next',
      prev: '/prev',
    },
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
  };

  let wrapper: RenderResult;

  beforeEach(async () => {
    (getUserItems as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: userItems, status: 200 });
    wrapper = render(
      <UserProvider value={testUser}>
        <UserItems />
      </UserProvider>,
    );
    await waitFor(() => expect(getUserItems).toHaveBeenCalledTimes(1));
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

describe('With no logged-in user', () => {
  const userItems: APICollectionPaginated<Item> = {
    data: [],
    links: {
      first: '/first',
      last: '/last',
      next: '/next',
      prev: '/prev',
    },
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
  };

  let wrapper: RenderResult;

  beforeEach(async () => {
    (getUserItems as jest.Mock)
      .mockClear()
      .mockResolvedValue({ data: userItems, status: 200 });
    wrapper = render(
      <UserProvider value={user()}>
        <UserItems />
      </UserProvider>,
      { user: null },
    );
    await waitFor(() => expect(getUserItems).toHaveBeenCalledTimes(1));
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