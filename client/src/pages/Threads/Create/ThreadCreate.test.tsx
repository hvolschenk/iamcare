import { faker } from '@faker-js/faker';
import { AxiosError, AxiosHeaders, type AxiosResponse } from 'axios';
import React from 'react';
import { useLoaderData } from 'react-router-dom';

import threadCreate from '~/src/api/threads/create';
import l10n from '~/src/l10n';
import {
  type RenderResult,
  fireEvent,
  renderRouter,
  testUser,
  waitFor,
} from '~/src/testing';
import { item as itemMock } from '~/src/testing/mocks';
import type { Item } from '~/src/types/Item';
import { threadCreate as threadCreateURL, threads } from '~/src/urls';

import { Component as ThreadCreate } from './index';

jest.mock('react-router-dom', () => {
  const reactRouterDom = jest.requireActual('react-router-dom');
  return {
    ...reactRouterDom,
    useLoaderData: jest.fn(),
  };
});
jest.mock('~/src/api/items/get');
jest.mock('~/src/api/threads/create');

const item = itemMock();

describe('When the logged-in user owns the item', () => {
  const itemOwned: Item = { ...item, user: testUser };

  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(itemOwned);
    wrapper = renderRouter(
      [
        { Component: ThreadCreate, path: threadCreateURL() },
        { element: <div data-testid="threads" />, path: threads() },
      ],
      [threadCreateURL(item.id.toString())],
    );
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('thread-create__error--item-owned'),
      ).toBeInTheDocument(),
    );
  });

  test('Shows a warning that the user already owns the item', () => {
    expect(
      wrapper.queryByTestId('thread-create__error--item-owned'),
    ).toBeInTheDocument();
  });

  describe('When clicking the search button', () => {
    beforeEach(() => {
      fireEvent.click(wrapper.getByTestId('thread-create__error--item-owned'));
    });

    test('Shows the search dialog', () => {
      expect(wrapper.queryByTestId('search__input')).toBeInTheDocument();
    });
  });
});

describe('When the item is owned by another user', () => {
  let wrapper: RenderResult;

  beforeEach(async () => {
    (useLoaderData as jest.Mock).mockClear().mockReturnValue(item);
    wrapper = renderRouter(
      [
        { Component: ThreadCreate, path: threadCreateURL() },
        { element: <div data-testid="threads" />, path: threads() },
      ],
      [threadCreateURL(item.id.toString())],
    );
    await waitFor(() =>
      expect(
        wrapper.queryByTestId('thread-create__action--create'),
      ).toBeInTheDocument(),
    );
  });

  test('Renders the thread creation form', () => {
    expect(
      wrapper.queryByTestId('thread-create__action--create'),
    ).toBeInTheDocument();
  });

  describe('After filling in the form', () => {
    beforeEach(async () => {
      const paragraph = faker.lorem.paragraph();
      fireEvent.change(wrapper.getByTestId('thread-create__field--message'), {
        target: { value: paragraph },
      });
      await waitFor(() =>
        expect(
          wrapper.getByTestId('thread-create__field--message'),
        ).toHaveValue(paragraph),
      );
      await waitFor(() =>
        expect(
          wrapper.queryByTestId('thread-create__action--create'),
        ).not.toBeDisabled(),
      );
    });

    describe('When the API call fails', () => {
      describe('With a generic error', () => {
        beforeEach(async () => {
          const headers = new AxiosHeaders();
          const response: AxiosResponse = {
            config: { headers },
            data: null,
            headers,
            status: 500,
            statusText: 'Internal Server Error',
          };
          const error = new AxiosError(
            'Internal Server Error',
            '500',
            undefined,
            undefined,
            response,
          );
          (threadCreate as jest.Mock).mockClear().mockRejectedValue(error);
          fireEvent.click(wrapper.getByTestId('thread-create__action--create'));
          await waitFor(() => expect(threadCreate).toHaveBeenCalledTimes(1));
          await waitFor(
            () =>
              expect(wrapper.queryByTestId('notifications__notification'))
                .toBeInTheDocument,
          );
        });

        test('Shows a notification that something went wrong', () => {
          expect(
            wrapper.queryByTestId('notifications__notification'),
          ).toHaveTextContent(l10n.threadCreateError);
        });
      });

      describe('With validation errors', () => {
        const validationErrors: Record<string, string[]> = {
          message: ['Not message-y enough'],
        };

        beforeEach(async () => {
          const headers = new AxiosHeaders();
          const response: AxiosResponse = {
            config: { headers },
            data: {
              errors: validationErrors,
              message: 'There were errors creating the thread',
            },
            headers,
            status: 422,
            statusText: 'Unprocessable Content',
          };
          const error = new AxiosError(
            'Unprocessable Content',
            '422',
            undefined,
            undefined,
            response,
          );
          (threadCreate as jest.Mock).mockClear().mockRejectedValue(error);
          fireEvent.click(wrapper.getByTestId('thread-create__action--create'));
          await waitFor(() => expect(threadCreate).toHaveBeenCalledTimes(1));
          await waitFor(
            () =>
              expect(wrapper.queryByTestId('notifications__notification'))
                .toBeInTheDocument,
          );
        });

        test('Shows the error for the message field', () => {
          expect(
            wrapper.queryByTestId('item-form__message__helper-text'),
          ).toHaveTextContent(validationErrors.message[0]);
        });
      });
    });

    describe('When the API call succeeds', () => {
      beforeEach(async () => {
        (threadCreate as jest.Mock).mockClear().mockResolvedValue(undefined);
        fireEvent.click(wrapper.getByTestId('thread-create__action--create'));
        await waitFor(() => expect(threadCreate).toHaveBeenCalledTimes(1));
        await waitFor(
          () =>
            expect(wrapper.queryByTestId('notifications__notification'))
              .toBeInTheDocument,
        );
      });

      test('Shows a success notification', () => {
        expect(
          wrapper.queryByTestId('notifications__notification'),
        ).toHaveTextContent(l10n.threadCreateSuccess);
      });

      test('Redirects to the threads list page', () => {
        expect(wrapper.queryByTestId('threads')).toBeInTheDocument();
      });
    });
  });
});
